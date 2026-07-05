"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const staffSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  designation: z.enum(["ADMIN", "TEACHER", "COUNSELOR", "RECEPTION", "ACCOUNTANT"]),
  mobile: z.string().min(10, "Mobile must be at least 10 digits"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  joiningDate: z.date({ error: "Joining date is required" }),
  salary: z.number().min(0).optional(),
})

type StaffInput = z.infer<typeof staffSchema>

export async function createStaff(data: StaffInput) {
  try {
    const validated = staffSchema.parse(data)

    // Generate employee code
    const lastStaff = await prisma.staff.findFirst({
      orderBy: { createdAt: "desc" },
      select: { employeeCode: true },
    })

    let nextNumber = 1
    if (lastStaff?.employeeCode) {
      const match = lastStaff.employeeCode.match(/EMP-(\d+)/)
      if (match) {
        nextNumber = parseInt(match[1]) + 1
      }
    }
    const employeeCode = `EMP-${String(nextNumber).padStart(4, "0")}`

    const staff = await prisma.staff.create({
      data: {
        employeeCode,
        ...validated,
        email: validated.email || null,
      },
    })

    revalidatePath("/staff")
    return { success: true, data: staff }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: "Failed to create staff" }
  }
}

export async function updateStaff(id: string, data: StaffInput) {
  try {
    const validated = staffSchema.parse(data)

    const staff = await prisma.staff.update({
      where: { id },
      data: {
        ...validated,
        email: validated.email || null,
      },
    })

    revalidatePath("/staff")
    return { success: true, data: staff }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: "Failed to update staff" }
  }
}

export async function deleteStaff(id: string) {
  try {
    await prisma.staff.update({
      where: { id },
      data: { status: "INACTIVE" },
    })

    revalidatePath("/staff")
    return { success: true }
  } catch {
    return { success: false, error: "Failed to delete staff" }
  }
}

export async function getStaff() {
  try {
    const staff = await prisma.staff.findMany({
      include: {
        _count: {
          select: { batches: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, data: staff }
  } catch {
    return { success: false, error: "Failed to fetch staff" }
  }
}

export async function getStaffById(id: string) {
  try {
    const staff = await prisma.staff.findUnique({
      where: { id },
      include: {
        batches: {
          include: {
            course: true,
          },
        },
      },
    })

    if (!staff) {
      return { success: false, error: "Staff not found" }
    }

    return { success: true, data: staff }
  } catch {
    return { success: false, error: "Failed to fetch staff" }
  }
}

export async function getTrainers() {
  try {
    const trainers = await prisma.staff.findMany({
      where: {
        designation: "TEACHER",
        status: "ACTIVE",
      },
      orderBy: { fullName: "asc" },
    })

    return { success: true, data: trainers }
  } catch {
    return { success: false, error: "Failed to fetch trainers" }
  }
}
