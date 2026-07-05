"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const studentSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  mobile: z.string().min(10, "Mobile must be at least 10 digits"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  dob: z.date().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  admissionDate: z.date({ error: "Admission date is required" }),
  remarks: z.string().optional(),
})

type StudentInput = z.infer<typeof studentSchema>

export async function createStudent(data: StudentInput) {
  try {
    const validated = studentSchema.parse(data)

    const lastStudent = await prisma.student.findFirst({
      orderBy: { createdAt: "desc" },
      select: { studentCode: true },
    })

    let nextNumber = 1
    if (lastStudent?.studentCode) {
      const match = lastStudent.studentCode.match(/STU-(\d{4})-(\d+)/)
      if (match) {
        nextNumber = parseInt(match[2]) + 1
      }
    }
    const year = new Date().getFullYear()
    const studentCode = `STU-${year}-${String(nextNumber).padStart(4, "0")}`

    const student = await prisma.student.create({
      data: {
        studentCode,
        ...validated,
        email: validated.email || undefined,
      },
    })

    revalidatePath("/students")
    return { success: true, data: student }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: "Failed to create student" }
  }
}

export async function updateStudent(id: string, data: StudentInput) {
  try {
    const validated = studentSchema.parse(data)

    const student = await prisma.student.update({
      where: { id },
      data: {
        ...validated,
        email: validated.email || undefined,
      },
    })

    revalidatePath("/students")
    return { success: true, data: student }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: "Failed to update student" }
  }
}

export async function deleteStudent(id: string) {
  try {
    await prisma.student.update({
      where: { id },
      data: { status: "INACTIVE" },
    })

    revalidatePath("/students")
    return { success: true }
  } catch {
    return { success: false, error: "Failed to delete student" }
  }
}

export async function getStudents() {
  try {
    const students = await prisma.student.findMany({
      include: {
        enrollments: {
          include: {
            course: true,
            batch: true,
          },
        },
        _count: {
          select: { enrollments: true, payments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, data: students }
  } catch {
    return { success: false, error: "Failed to fetch students" }
  }
}

export async function getStudentById(id: string) {
  try {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            course: true,
            batch: true,
          },
        },
        payments: {
          orderBy: { paymentDate: "desc" },
          take: 10,
        },
      },
    })

    if (!student) {
      return { success: false, error: "Student not found" }
    }

    return { success: true, data: student }
  } catch {
    return { success: false, error: "Failed to fetch student" }
  }
}

export async function updateStudentStatus(id: string, status: string) {
  try {
    const student = await prisma.student.update({
      where: { id },
      data: { status: status as "ACTIVE" | "COMPLETED" | "INACTIVE" | "DROPPED" | "ALUMNI" },
    })

    revalidatePath("/students")
    return { success: true, data: student }
  } catch {
    return { success: false, error: "Failed to update student status" }
  }
}
