"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const batchSchema = z.object({
  batchName: z.string().min(2, "Batch name must be at least 2 characters"),
  courseId: z.string().min(1, "Course is required"),
  trainerId: z.string().optional(),
  startDate: z.date({ error: "Start date is required" }),
  endDate: z.date().optional(),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  classroom: z.string().optional(),
})

type BatchInput = z.infer<typeof batchSchema>

export async function createBatch(data: BatchInput) {
  try {
    const validated = batchSchema.parse(data)

    // Generate batch code
    const lastBatch = await prisma.batch.findFirst({
      orderBy: { createdAt: "desc" },
      select: { batchCode: true },
    })

    let nextNumber = 1
    if (lastBatch?.batchCode) {
      const match = lastBatch.batchCode.match(/BTH-(\d+)/)
      if (match) {
        nextNumber = parseInt(match[1]) + 1
      }
    }
    const batchCode = `BTH-${String(nextNumber).padStart(4, "0")}`

    const batch = await prisma.batch.create({
      data: {
        batchCode,
        ...validated,
      },
      include: {
        course: true,
        trainer: true,
      },
    })

    revalidatePath("/batches")
    return { success: true, data: batch }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: "Failed to create batch" }
  }
}

export async function updateBatch(id: string, data: BatchInput) {
  try {
    const validated = batchSchema.parse(data)

    const batch = await prisma.batch.update({
      where: { id },
      data: validated,
      include: {
        course: true,
        trainer: true,
      },
    })

    revalidatePath("/batches")
    return { success: true, data: batch }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: "Failed to update batch" }
  }
}

export async function deleteBatch(id: string) {
  try {
    await prisma.batch.update({
      where: { id },
      data: { status: "CANCELLED" },
    })

    revalidatePath("/batches")
    return { success: true }
  } catch {
    return { success: false, error: "Failed to delete batch" }
  }
}

export async function getBatches() {
  try {
    const batches = await prisma.batch.findMany({
      include: {
        course: true,
        trainer: true,
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, data: batches }
  } catch {
    return { success: false, error: "Failed to fetch batches" }
  }
}

export async function getBatchById(id: string) {
  try {
    const batch = await prisma.batch.findUnique({
      where: { id },
      include: {
        course: true,
        trainer: true,
        enrollments: {
          include: {
            student: true,
          },
        },
      },
    })

    if (!batch) {
      return { success: false, error: "Batch not found" }
    }

    return { success: true, data: batch }
  } catch {
    return { success: false, error: "Failed to fetch batch" }
  }
}
