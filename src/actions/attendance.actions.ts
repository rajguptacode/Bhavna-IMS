"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const markAttendanceSchema = z.object({
  batchId: z.string().min(1, "Batch is required"),
  attendanceDate: z.date({ error: "Date is required" }),
  records: z.array(
    z.object({
      studentId: z.string(),
      status: z.enum(["PRESENT", "ABSENT", "LEAVE", "LATE"]),
      remarks: z.string().optional(),
    })
  ),
})

type MarkAttendanceInput = z.infer<typeof markAttendanceSchema>

export async function markAttendance(data: MarkAttendanceInput) {
  try {
    const validated = markAttendanceSchema.parse(data)

    const dateOnly = new Date(validated.attendanceDate)
    dateOnly.setHours(0, 0, 0, 0)

    for (const record of validated.records) {
      const existing = await prisma.attendance.findUnique({
        where: {
          studentId_attendanceDate: {
            studentId: record.studentId,
            attendanceDate: dateOnly,
          },
        },
      })

      if (existing) {
        await prisma.attendance.update({
          where: { id: existing.id },
          data: {
            status: record.status,
            remarks: record.remarks || undefined,
          },
        })
      } else {
        await prisma.attendance.create({
          data: {
            studentId: record.studentId,
            batchId: validated.batchId,
            attendanceDate: dateOnly,
            status: record.status,
            remarks: record.remarks || undefined,
          },
        })
      }
    }

    revalidatePath("/attendance")
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: "Failed to mark attendance" }
  }
}

export async function getAttendanceByBatchAndDate(batchId: string, date: string) {
  try {
    const attendanceDate = new Date(date)
    attendanceDate.setHours(0, 0, 0, 0)

    const nextDay = new Date(attendanceDate)
    nextDay.setDate(nextDay.getDate() + 1)

    const attendance = await prisma.attendance.findMany({
      where: {
        batchId,
        attendanceDate: {
          gte: attendanceDate,
          lt: nextDay,
        },
      },
      include: {
        student: {
          select: { id: true, fullName: true, studentCode: true, mobile: true },
        },
      },
    })

    return { success: true, data: attendance }
  } catch {
    return { success: false, error: "Failed to fetch attendance" }
  }
}

export async function getBatchStudents(batchId: string) {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: {
        batchId,
        status: "ACTIVE",
      },
      include: {
        student: {
          select: { id: true, fullName: true, studentCode: true, mobile: true },
        },
      },
      orderBy: { student: { fullName: "asc" } },
    })

    return {
      success: true,
      data: enrollments.map((e) => e.student),
    }
  } catch {
    return { success: false, error: "Failed to fetch batch students" }
  }
}

export async function getActiveBatches() {
  try {
    const batches = await prisma.batch.findMany({
      where: { status: "ACTIVE" },
      include: {
        course: { select: { name: true } },
        trainer: { select: { fullName: true } },
        _count: { select: { enrollments: true } },
      },
      orderBy: { startDate: "desc" },
    })

    return { success: true, data: batches }
  } catch {
    return { success: false, error: "Failed to fetch active batches" }
  }
}

export async function getAttendanceStats(batchId: string, startDate: string, endDate: string) {
  try {
    const start = new Date(startDate)
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)

    const attendance = await prisma.attendance.findMany({
      where: {
        batchId,
        attendanceDate: { gte: start, lte: end },
      },
      include: {
        student: { select: { id: true, fullName: true, studentCode: true } },
      },
    })

    const stats: Record<string, { present: number; absent: number; leave: number; late: number; total: number; student: { id: string; fullName: string; studentCode: string } }> = {}

    for (const record of attendance) {
      const sid = record.studentId
      if (!stats[sid]) {
        stats[sid] = { present: 0, absent: 0, leave: 0, late: 0, total: 0, student: record.student }
      }
      stats[sid].total++
      if (record.status === "PRESENT") stats[sid].present++
      else if (record.status === "ABSENT") stats[sid].absent++
      else if (record.status === "LEAVE") stats[sid].leave++
      else if (record.status === "LATE") stats[sid].late++
    }

    return { success: true, data: Object.values(stats) }
  } catch {
    return { success: false, error: "Failed to fetch attendance stats" }
  }
}
