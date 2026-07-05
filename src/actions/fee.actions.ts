"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const feeStructureSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  registrationFee: z.number().min(0, "Registration fee must be at least 0"),
  courseFee: z.number().min(0, "Course fee must be at least 0"),
  installmentAllowed: z.boolean(),
  installmentCount: z.number().min(1).optional(),
})

type FeeStructureInput = z.infer<typeof feeStructureSchema>

export async function upsertFeeStructure(data: FeeStructureInput) {
  try {
    const validated = feeStructureSchema.parse(data)

    const existing = await prisma.feeStructure.findUnique({
      where: { courseId: validated.courseId },
    })

    let feeStructure
    if (existing) {
      feeStructure = await prisma.feeStructure.update({
        where: { courseId: validated.courseId },
        data: {
          registrationFee: validated.registrationFee,
          courseFee: validated.courseFee,
          installmentAllowed: validated.installmentAllowed,
          installmentCount: validated.installmentAllowed ? validated.installmentCount : null,
        },
        include: { course: true },
      })
    } else {
      feeStructure = await prisma.feeStructure.create({
        data: {
          courseId: validated.courseId,
          registrationFee: validated.registrationFee,
          courseFee: validated.courseFee,
          installmentAllowed: validated.installmentAllowed,
          installmentCount: validated.installmentAllowed ? validated.installmentCount : null,
        },
        include: { course: true },
      })
    }

    revalidatePath("/fees")
    return { success: true, data: feeStructure }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: "Failed to save fee structure" }
  }
}

export async function getFeeStructures() {
  try {
    const structures = await prisma.feeStructure.findMany({
      include: {
        course: {
          select: { name: true, courseCode: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, data: structures }
  } catch {
    return { success: false, error: "Failed to fetch fee structures" }
  }
}

export async function deleteFeeStructure(id: string) {
  try {
    await prisma.feeStructure.delete({ where: { id } })
    revalidatePath("/fees")
    return { success: true }
  } catch {
    return { success: false, error: "Failed to delete fee structure" }
  }
}

const paymentSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  enrollmentId: z.string().min(1, "Enrollment is required"),
  amount: z.number().min(1, "Amount must be at least 1"),
  paymentDate: z.date({ error: "Payment date is required" }),
  paymentMode: z.enum(["CASH", "UPI", "BANK_TRANSFER", "CARD", "CHEQUE"]),
  transactionReference: z.string().optional(),
  remarks: z.string().optional(),
})

type PaymentInput = z.infer<typeof paymentSchema>

export async function createPayment(data: PaymentInput) {
  try {
    const validated = paymentSchema.parse(data)

    const payment = await prisma.payment.create({
      data: {
        ...validated,
        transactionReference: validated.transactionReference || undefined,
        remarks: validated.remarks || undefined,
      },
      include: {
        student: { select: { fullName: true, studentCode: true } },
        enrollment: {
          include: {
            course: { select: { name: true } },
            batch: { select: { batchName: true } },
          },
        },
      },
    })

    revalidatePath("/fees")
    return { success: true, data: payment }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: "Failed to record payment" }
  }
}

export async function getPayments() {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        student: { select: { fullName: true, studentCode: true, mobile: true } },
        enrollment: {
          include: {
            course: { select: { name: true } },
            batch: { select: { batchName: true } },
          },
        },
      },
      orderBy: { paymentDate: "desc" },
    })

    return { success: true, data: payments }
  } catch {
    return { success: false, error: "Failed to fetch payments" }
  }
}

export async function getActiveEnrollments() {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { status: "ACTIVE" },
      include: {
        student: { select: { id: true, fullName: true, studentCode: true } },
        course: { select: { id: true, name: true, fees: true } },
        batch: { select: { batchName: true } },
        payments: { select: { amount: true } },
      },
      orderBy: { enrollmentDate: "desc" },
    })

    return { success: true, data: enrollments }
  } catch {
    return { success: false, error: "Failed to fetch enrollments" }
  }
}

export async function getPendingFees() {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { status: "ACTIVE" },
      include: {
        student: { select: { fullName: true, studentCode: true, mobile: true } },
        course: { select: { name: true, fees: true } },
        batch: { select: { batchName: true } },
        payments: { select: { amount: true } },
      },
      orderBy: { enrollmentDate: "desc" },
    })

    const pending = enrollments
      .map((e) => {
        const totalPaid = e.payments.reduce((sum, p) => sum + p.amount, 0)
        const pending = e.course.fees - totalPaid
        return {
          enrollmentId: e.id,
          student: e.student,
          course: e.course,
          batch: e.batch,
          totalFees: e.course.fees,
          totalPaid,
          pendingAmount: pending,
        }
      })
      .filter((e) => e.pendingAmount > 0)

    return { success: true, data: pending }
  } catch {
    return { success: false, error: "Failed to calculate pending fees" }
  }
}
