"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const courseSchema = z.object({
  name: z.string().min(2, "Course name must be at least 2 characters"),
  description: z.string().optional(),
  duration: z.number().min(1, "Duration must be at least 1"),
  durationType: z.enum(["DAYS", "WEEKS", "MONTHS"]),
  fees: z.number().min(0, "Fees must be at least 0"),
})

type CourseInput = z.infer<typeof courseSchema>

export async function createCourse(data: CourseInput) {
  try {
    const validated = courseSchema.parse(data)

    // Generate course code
    const lastCourse = await prisma.course.findFirst({
      orderBy: { createdAt: "desc" },
      select: { courseCode: true },
    })

    let nextNumber = 1
    if (lastCourse?.courseCode) {
      const match = lastCourse.courseCode.match(/CRS-(\d+)/)
      if (match) {
        nextNumber = parseInt(match[1]) + 1
      }
    }
    const courseCode = `CRS-${String(nextNumber).padStart(4, "0")}`

    const course = await prisma.course.create({
      data: {
        courseCode,
        ...validated,
      },
    })

    revalidatePath("/courses")
    return { success: true, data: course }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: "Failed to create course" }
  }
}

export async function updateCourse(id: string, data: CourseInput) {
  try {
    const validated = courseSchema.parse(data)

    const course = await prisma.course.update({
      where: { id },
      data: validated,
    })

    revalidatePath("/courses")
    return { success: true, data: course }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: "Failed to update course" }
  }
}

export async function deleteCourse(id: string) {
  try {
    await prisma.course.update({
      where: { id },
      data: { isActive: false },
    })

    revalidatePath("/courses")
    return { success: true }
  } catch {
    return { success: false, error: "Failed to delete course" }
  }
}

export async function getCourses() {
  try {
    const courses = await prisma.course.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { batches: true, enrollments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, data: courses }
  } catch {
    return { success: false, error: "Failed to fetch courses" }
  }
}

export async function getCourseById(id: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        batches: true,
        feeStructure: true,
        _count: {
          select: { enrollments: true },
        },
      },
    })

    if (!course) {
      return { success: false, error: "Course not found" }
    }

    return { success: true, data: course }
  } catch {
    return { success: false, error: "Failed to fetch course" }
  }
}
