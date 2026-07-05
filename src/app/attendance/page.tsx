"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Check, X, Clock, Minus } from "lucide-react"
import {
  markAttendance,
  getAttendanceByBatchAndDate,
  getBatchStudents,
  getActiveBatches,
} from "@/actions/attendance.actions"
import { ATTENDANCE_STATUS_COLORS, ATTENDANCE_STATUS_LABELS } from "@/lib/constants"

interface Batch {
  id: string
  batchName: string
  course: { name: string }
  trainer: { fullName: string } | null
  _count: { enrollments: number }
}

interface Student {
  id: string
  fullName: string
  studentCode: string
  mobile: string
}

interface AttendanceRecord {
  studentId: string
  status: "PRESENT" | "ABSENT" | "LEAVE" | "LATE"
  remarks?: string
}

export default function AttendancePage() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [selectedBatchId, setSelectedBatchId] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getActiveBatches().then((result) => {
      if (result.success) setBatches(result.data as Batch[])
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!selectedBatchId || !selectedDate) return

    async function fetchData() {
      setIsFetching(true)
      const [studentsResult, attendanceResult] = await Promise.all([
        getBatchStudents(selectedBatchId),
        getAttendanceByBatchAndDate(selectedBatchId, selectedDate),
      ])

      if (studentsResult.success) {
        setStudents(studentsResult.data as Student[])
      }

      const existingAttendance: Record<string, AttendanceRecord> = {}
      if (attendanceResult.success) {
        for (const record of attendanceResult.data as { studentId: string; status: string; remarks?: string }[]) {
          existingAttendance[record.studentId] = {
            studentId: record.studentId,
            status: record.status as AttendanceRecord["status"],
            remarks: record.remarks,
          }
        }
      }

      setAttendance(existingAttendance)
      setIsFetching(false)
    }

    fetchData()
  }, [selectedBatchId, selectedDate])

  function setStatus(studentId: string, status: AttendanceRecord["status"]) {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        studentId,
        status,
        remarks: prev[studentId]?.remarks,
      },
    }))
  }

  function setAllPresent() {
    const updated: Record<string, AttendanceRecord> = {}
    for (const student of students) {
      updated[student.id] = {
        studentId: student.id,
        status: "PRESENT",
      }
    }
    setAttendance(updated)
  }

  async function handleSave() {
    if (!selectedBatchId || students.length === 0) return

    setIsSaving(true)
    const records = students.map((s) => ({
      studentId: s.id,
      status: attendance[s.id]?.status || "ABSENT",
      remarks: attendance[s.id]?.remarks,
    }))

    const result = await markAttendance({
      batchId: selectedBatchId,
      attendanceDate: new Date(selectedDate),
      records,
    })

    if (result.success) {
      toast.success("Attendance saved!")
    } else {
      toast.error(result.error || "Failed to save attendance")
    }
    setIsSaving(false)
  }

  const presentCount = Object.values(attendance).filter((a) => a.status === "PRESENT").length
  const absentCount = Object.values(attendance).filter((a) => a.status === "ABSENT").length
  const totalStudents = students.length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Attendance</h1>
        <p className="text-muted-foreground">Mark and view daily attendance</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Batch</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedBatchId} onValueChange={(v) => v && setSelectedBatchId(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select active batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.batchName} ({batch._count.enrollments} students)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600">Present: {presentCount}</span>
                  <span className="text-red-600">Absent: {absentCount}</span>
                  <span className="text-muted-foreground">Total: {totalStudents}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {selectedBatchId && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Mark Attendance</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={setAllPresent}>
                    All Present
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isSaving || students.length === 0}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Attendance"
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isFetching ? (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-muted-foreground">Loading students...</p>
                  </div>
                ) : students.length === 0 ? (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-muted-foreground">No students enrolled in this batch</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {students.map((student) => {
                      const status = attendance[student.id]?.status
                      return (
                        <div
                          key={student.id}
                          className="flex items-center justify-between rounded-md border p-3"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{student.fullName}</span>
                            <span className="text-sm text-muted-foreground">({student.studentCode})</span>
                          </div>
                          <div className="flex gap-1">
                            {(["PRESENT", "ABSENT", "LEAVE", "LATE"] as const).map((s) => {
                              const icons: Record<string, React.ReactNode> = {
                                PRESENT: <Check className="h-4 w-4" />,
                                ABSENT: <X className="h-4 w-4" />,
                                LEAVE: <Minus className="h-4 w-4" />,
                                LATE: <Clock className="h-4 w-4" />,
                              }
                              const colors: Record<string, string> = {
                                PRESENT: status === s ? "bg-green-500 text-white" : "hover:bg-green-100",
                                ABSENT: status === s ? "bg-red-500 text-white" : "hover:bg-red-100",
                                LEAVE: status === s ? "bg-yellow-500 text-white" : "hover:bg-yellow-100",
                                LATE: status === s ? "bg-orange-500 text-white" : "hover:bg-orange-100",
                              }
                              return (
                                <Button
                                  key={s}
                                  variant="outline"
                                  size="sm"
                                  className={`h-8 w-8 p-0 ${colors[s]}`}
                                  onClick={() => setStatus(student.id, s)}
                                >
                                  {icons[s]}
                                </Button>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {selectedBatchId && !isFetching && students.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attendance Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(["PRESENT", "ABSENT", "LEAVE", "LATE"] as const).map((s) => {
                    const count = Object.values(attendance).filter((a) => a.status === s).length
                    return (
                      <div key={s} className="rounded-md border p-3 text-center">
                        <Badge className={ATTENDANCE_STATUS_COLORS[s]}>
                          {ATTENDANCE_STATUS_LABELS[s]}
                        </Badge>
                        <div className="mt-2 text-2xl font-bold">{count}</div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
