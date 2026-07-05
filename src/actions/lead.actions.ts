"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const leadSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z.string().min(10, "Mobile must be at least 10 digits"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  source: z.enum(["WEBSITE", "WALK_IN", "WHATSAPP", "FACEBOOK", "INSTAGRAM", "REFERRAL", "CALL", "OTHER"]),
  status: z.enum(["NEW", "CONTACTED", "INTERESTED", "DEMO_SCHEDULED", "ADMISSION_PENDING", "CONVERTED", "LOST"]).optional(),
  assignedTo: z.string().optional(),
  remarks: z.string().optional(),
})

type LeadInput = z.infer<typeof leadSchema>

export async function createLead(data: LeadInput) {
  try {
    const validated = leadSchema.parse(data)

    const lastLead = await prisma.lead.findFirst({
      orderBy: { createdAt: "desc" },
      select: { leadCode: true },
    })

    let nextNumber = 1
    if (lastLead?.leadCode) {
      const match = lastLead.leadCode.match(/LED-(\d+)/)
      if (match) {
        nextNumber = parseInt(match[1]) + 1
      }
    }
    const leadCode = `LED-${String(nextNumber).padStart(4, "0")}`

    const lead = await prisma.lead.create({
      data: {
        leadCode,
        fullName: validated.fullName,
        mobile: validated.mobile,
        email: validated.email || undefined,
        source: validated.source,
        status: validated.status || "NEW",
        assignedTo: validated.assignedTo || undefined,
        remarks: validated.remarks || undefined,
      },
    })

    revalidatePath("/leads")
    return { success: true, data: lead }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: "Failed to create lead" }
  }
}

export async function updateLead(id: string, data: LeadInput) {
  try {
    const validated = leadSchema.parse(data)

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        fullName: validated.fullName,
        mobile: validated.mobile,
        email: validated.email || undefined,
        source: validated.source,
        status: validated.status,
        assignedTo: validated.assignedTo || undefined,
        remarks: validated.remarks || undefined,
      },
    })

    revalidatePath("/leads")
    return { success: true, data: lead }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: "Failed to update lead" }
  }
}

export async function updateLeadStatus(id: string, status: string) {
  try {
    const lead = await prisma.lead.update({
      where: { id },
      data: { status: status as "NEW" | "CONTACTED" | "INTERESTED" | "DEMO_SCHEDULED" | "ADMISSION_PENDING" | "CONVERTED" | "LOST" },
    })

    revalidatePath("/leads")
    return { success: true, data: lead }
  } catch {
    return { success: false, error: "Failed to update lead status" }
  }
}

export async function deleteLead(id: string) {
  try {
    await prisma.leadActivity.deleteMany({ where: { leadId: id } })
    await prisma.lead.delete({ where: { id } })

    revalidatePath("/leads")
    return { success: true }
  } catch {
    return { success: false, error: "Failed to delete lead" }
  }
}

export async function getLeads() {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        activities: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: { select: { activities: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, data: leads }
  } catch {
    return { success: false, error: "Failed to fetch leads" }
  }
}

export async function getLeadById(id: string) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        activities: {
          include: {
            creator: { select: { fullName: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!lead) {
      return { success: false, error: "Lead not found" }
    }

    return { success: true, data: lead }
  } catch {
    return { success: false, error: "Failed to fetch lead" }
  }
}

const activitySchema = z.object({
  leadId: z.string().min(1, "Lead is required"),
  activityType: z.enum(["CALL", "WHATSAPP", "EMAIL", "VISIT", "DEMO", "MEETING", "OTHER"]),
  notes: z.string().min(1, "Notes are required"),
  nextFollowUp: z.date().optional(),
  createdBy: z.string().min(1, "Creator is required"),
})

type ActivityInput = z.infer<typeof activitySchema>

export async function createLeadActivity(data: ActivityInput) {
  try {
    const validated = activitySchema.parse(data)

    const activity = await prisma.leadActivity.create({
      data: {
        leadId: validated.leadId,
        activityType: validated.activityType,
        notes: validated.notes,
        nextFollowUp: validated.nextFollowUp || undefined,
        createdBy: validated.createdBy,
      },
      include: {
        creator: { select: { fullName: true } },
      },
    })

    revalidatePath("/leads")
    return { success: true, data: activity }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: "Failed to create activity" }
  }
}

export async function getLeadActivities(leadId: string) {
  try {
    const activities = await prisma.leadActivity.findMany({
      where: { leadId },
      include: {
        creator: { select: { fullName: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, data: activities }
  } catch {
    return { success: false, error: "Failed to fetch activities" }
  }
}

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, fullName: true, email: true },
      orderBy: { fullName: "asc" },
    })

    return { success: true, data: users }
  } catch {
    return { success: false, error: "Failed to fetch users" }
  }
}
