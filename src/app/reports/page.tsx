"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, BookOpen, DollarSign, Target, TrendingUp, BarChart3 } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import {
  getDashboardStats,
  getFeeReport,
  getAttendanceReport,
  getLeadReport,
  getEnrollmentReport,
} from "@/actions/report.actions"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316"]

export default function ReportsPage() {
  const [stats, setStats] = useState<{ totalStudents: number; totalBatches: number; totalStaff: number; totalCourses: number } | null>(null)
  const [feeReport, setFeeReport] = useState<{ totalCollected: number; totalPayments: number; byCourse: { name: string; amount: number }[]; byMonth: { month: string; amount: number }[] } | null>(null)
  const [attendanceReport, setAttendanceReport] = useState<{ total: number; present: number; absent: number; leave: number; late: number; percentage: number; byBatch: { name: string; present: number; absent: number }[] } | null>(null)
  const [leadReport, setLeadReport] = useState<{ total: number; converted: number; lost: number; active: number; conversionRate: number; byStatus: { status: string; count: number }[]; bySource: { source: string; count: number }[] } | null>(null)
  const [enrollmentReport, setEnrollmentReport] = useState<{ total: number; active: number; completed: number; dropped: number; byCourse: { name: string; count: number }[] } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    Promise.all([
      getDashboardStats(),
      getFeeReport(),
      getAttendanceReport(),
      getLeadReport(),
      getEnrollmentReport(),
    ]).then(([s, f, a, l, e]) => {
      if (s.success) setStats(s.data as { totalStudents: number; totalBatches: number; totalStaff: number; totalCourses: number })
      if (f.success) setFeeReport(f.data as { totalCollected: number; totalPayments: number; byCourse: { name: string; amount: number }[]; byMonth: { month: string; amount: number }[] })
      if (a.success) setAttendanceReport(a.data as { total: number; present: number; absent: number; leave: number; late: number; percentage: number; byBatch: { name: string; present: number; absent: number }[] })
      if (l.success) setLeadReport(l.data as { total: number; converted: number; lost: number; active: number; conversionRate: number; byStatus: { status: string; count: number }[]; bySource: { source: string; count: number }[] })
      if (e.success) setEnrollmentReport(e.data as { total: number; active: number; completed: number; dropped: number; byCourse: { name: string; count: number }[] })
      setIsLoading(false)
    })
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Institute analytics and reports</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      ) : (
        <>
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalStudents}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCourses}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalBatches}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Staff</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalStaff}</div>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs defaultValue="fees">
            <TabsList>
              <TabsTrigger value="fees">Fees</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
            </TabsList>

            <TabsContent value="fees" className="space-y-4">
              {feeReport && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold flex items-center gap-2">
                          <DollarSign className="h-5 w-5" />
                          ₹{feeReport.totalCollected.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">{feeReport.totalPayments} payments</p>
                      </CardContent>
                    </Card>
                  </div>

                  {feeReport.byCourse.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Revenue by Course</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={feeReport.byCourse}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                            <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}

                  {feeReport.byMonth.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Monthly Collection</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={feeReport.byMonth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                            <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="attendance" className="space-y-4">
              {attendanceReport && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Total Records</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{attendanceReport.total}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Present</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{attendanceReport.present}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Absent</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">{attendanceReport.absent}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Leave</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{attendanceReport.leave}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Attendance %</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{attendanceReport.percentage}%</div>
                      </CardContent>
                    </Card>
                  </div>

                  {attendanceReport.byBatch.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Attendance by Batch</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={attendanceReport.byBatch}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="present" fill="#10b981" name="Present" />
                            <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="leads" className="space-y-4">
              {leadReport && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Total Leads</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{leadReport.total}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Converted</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{leadReport.converted}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Active</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{leadReport.active}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Conversion Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          {leadReport.conversionRate}%
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {leadReport.byStatus.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Leads by Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={leadReport.byStatus}
                                dataKey="count"
                                nameKey="status"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                              >
                                {leadReport.byStatus.map((_, index) => (
                                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    )}

                    {leadReport.bySource.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Leads by Source</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={leadReport.bySource}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="source" tick={{ fontSize: 12 }} />
                              <YAxis tick={{ fontSize: 12 }} />
                              <Tooltip />
                              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="enrollments" className="space-y-4">
              {enrollmentReport && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Total</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{enrollmentReport.total}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Active</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{enrollmentReport.active}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Completed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{enrollmentReport.completed}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Dropped</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">{enrollmentReport.dropped}</div>
                      </CardContent>
                    </Card>
                  </div>

                  {enrollmentReport.byCourse.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Enrollments by Course</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={enrollmentReport.byCourse}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
