"use server"

import { prisma } from "@/lib/prisma"

export async function getDashboardStats() {
  try {
    const [totalStudents, totalBatches, totalStaff, totalCourses] = await Promise.all([
      prisma.student.count({ where: { status: "ACTIVE" } }),
      prisma.batch.count({ where: { status: "ACTIVE" } }),
      prisma.staff.count({ where: { status: "ACTIVE" } }),
      prisma.course.count({ where: { isActive: true } }),
    ])

    return {
      success: true,
      data: { totalStudents, totalBatches, totalStaff, totalCourses },
    }
  } catch {
    return { success: false, error: "Failed to fetch dashboard stats" }
  }
}

export async function getFeeReport() {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        student: { select: { fullName: true } },
        enrollment: {
          include: {
            course: { select: { name: true } },
          },
        },
      },
      orderBy: { paymentDate: "desc" },
    })

    const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0)

    const byCourse: Record<string, number> = {}
    for (const payment of payments) {
      const courseName = payment.enrollment.course.name
      byCourse[courseName] = (byCourse[courseName] || 0) + payment.amount
    }

    const byMonth: Record<string, number> = {}
    for (const payment of payments) {
      const month = payment.paymentDate.toISOString().slice(0, 7)
      byMonth[month] = (byMonth[month] || 0) + payment.amount
    }

    return {
      success: true,
      data: {
        totalCollected,
        totalPayments: payments.length,
        byCourse: Object.entries(byCourse).map(([name, amount]) => ({ name, amount })),
        byMonth: Object.entries(byMonth)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([month, amount]) => ({ month, amount })),
      },
    }
  } catch {
    return { success: false, error: "Failed to fetch fee report" }
  }
}

export async function getAttendanceReport() {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const attendance = await prisma.attendance.findMany({
      where: {
        attendanceDate: { gte: startOfMonth, lte: endOfMonth },
      },
      include: {
        student: { select: { fullName: true } },
        batch: { select: { batchName: true } },
      },
    })

    const total = attendance.length
    const present = attendance.filter((a) => a.status === "PRESENT").length
    const absent = attendance.filter((a) => a.status === "ABSENT").length
    const leave = attendance.filter((a) => a.status === "LEAVE").length
    const late = attendance.filter((a) => a.status === "LATE").length

    const byBatch: Record<string, { present: number; absent: number; leave: number; late: number }> = {}
    for (const record of attendance) {
      const batchName = record.batch.batchName
      if (!byBatch[batchName]) {
        byBatch[batchName] = { present: 0, absent: 0, leave: 0, late: 0 }
      }
      if (record.status === "PRESENT") byBatch[batchName].present++
      else if (record.status === "ABSENT") byBatch[batchName].absent++
      else if (record.status === "LEAVE") byBatch[batchName].leave++
      else if (record.status === "LATE") byBatch[batchName].late++
    }

    return {
      success: true,
      data: {
        total,
        present,
        absent,
        leave,
        late,
        percentage: total > 0 ? Math.round((present / total) * 100) : 0,
        byBatch: Object.entries(byBatch).map(([name, stats]) => ({ name, ...stats })),
      },
    }
  } catch {
    return { success: false, error: "Failed to fetch attendance report" }
  }
}

export async function getLeadReport() {
  try {
    const leads = await prisma.lead.findMany()

    const total = leads.length
    const byStatus: Record<string, number> = {}
    for (const lead of leads) {
      byStatus[lead.status] = (byStatus[lead.status] || 0) + 1
    }

    const bySource: Record<string, number> = {}
    for (const lead of leads) {
      bySource[lead.source] = (bySource[lead.source] || 0) + 1
    }

    return {
      success: true,
      data: {
        total,
        converted: byStatus["CONVERTED"] || 0,
        lost: byStatus["LOST"] || 0,
        active: total - (byStatus["CONVERTED"] || 0) - (byStatus["LOST"] || 0),
        conversionRate: total > 0 ? Math.round(((byStatus["CONVERTED"] || 0) / total) * 100) : 0,
        byStatus: Object.entries(byStatus).map(([status, count]) => ({ status, count })),
        bySource: Object.entries(bySource).map(([source, count]) => ({ source, count })),
      },
    }
  } catch {
    return { success: false, error: "Failed to fetch lead report" }
  }
}

export async function getEnrollmentReport() {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: {
        course: { select: { name: true } },
        batch: { select: { batchName: true } },
      },
    })

    const total = enrollments.length
    const active = enrollments.filter((e) => e.status === "ACTIVE").length
    const completed = enrollments.filter((e) => e.status === "COMPLETED").length
    const dropped = enrollments.filter((e) => e.status === "DROPPED").length

    const byCourse: Record<string, number> = {}
    for (const e of enrollments) {
      byCourse[e.course.name] = (byCourse[e.course.name] || 0) + 1
    }

    return {
      success: true,
      data: {
        total,
        active,
        completed,
        dropped,
        byCourse: Object.entries(byCourse).map(([name, count]) => ({ name, count })),
      },
    }
  } catch {
    return { success: false, error: "Failed to fetch enrollment report" }
  }
}
