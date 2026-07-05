"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, DollarSign, AlertCircle } from "lucide-react"
import { FeeStructureForm } from "@/components/fees/fee-structure-form"
import { PaymentForm } from "@/components/fees/payment-form"
import { PaymentTable } from "@/components/fees/payment-table"
import {
  getFeeStructures,
  deleteFeeStructure,
  getPayments,
  getActiveEnrollments,
  getPendingFees,
} from "@/actions/fee.actions"
import { getCourses } from "@/actions/course.actions"

interface FeeStructure {
  id: string
  courseId: string
  registrationFee: number
  courseFee: number
  installmentAllowed: boolean
  installmentCount: number | null
  course: { name: string; courseCode: string }
}

interface PaymentRecord {
  id: string
  amount: number
  paymentDate: Date
  paymentMode: string
  transactionReference: string | null
  remarks: string | null
  student: { fullName: string; studentCode: string; mobile: string }
  enrollment: {
    course: { name: string }
    batch: { batchName: string }
  }
}

interface EnrollmentRecord {
  id: string
  student: { id: string; fullName: string; studentCode: string }
  course: { name: string; fees: number }
  batch: { batchName: string }
  payments: { amount: number }[]
}

interface PendingFee {
  enrollmentId: string
  student: { fullName: string; studentCode: string; mobile: string }
  course: { name: string; fees: number }
  batch: { batchName: string }
  totalFees: number
  totalPaid: number
  pendingAmount: number
}

export default function FeesPage() {
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([])
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [enrollments, setEnrollments] = useState<EnrollmentRecord[]>([])
  const [pendingFees, setPendingFees] = useState<PendingFee[]>([])
  const [courses, setCourses] = useState<{ id: string; name: string; courseCode: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isStructureDialogOpen, setIsStructureDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)

  async function fetchData() {
    const [structuresResult, paymentsResult, enrollmentsResult, pendingResult, coursesResult] =
      await Promise.all([
        getFeeStructures(),
        getPayments(),
        getActiveEnrollments(),
        getPendingFees(),
        getCourses(),
      ])

    if (structuresResult.success) setFeeStructures(structuresResult.data as FeeStructure[])
    if (paymentsResult.success) setPayments(paymentsResult.data as PaymentRecord[])
    if (enrollmentsResult.success) setEnrollments(enrollmentsResult.data as EnrollmentRecord[])
    if (pendingResult.success) setPendingFees(pendingResult.data as PendingFee[])
    if (coursesResult.success) setCourses(coursesResult.data as { id: string; name: string; courseCode: string }[])
    setIsLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData()
  }, [])

  async function handleDeleteStructure(id: string) {
    if (!confirm("Delete this fee structure?")) return
    const result = await deleteFeeStructure(id)
    if (result.success) {
      toast.success("Fee structure deleted!")
      fetchData()
    } else {
      toast.error(result.error || "Failed to delete")
    }
  }

  const totalPending = pendingFees.reduce((sum, f) => sum + f.pendingAmount, 0)
  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Fee Management</h1>
        <p className="text-muted-foreground">Manage fee structures, payments, and pending fees</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading fee data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalCollected.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{payments.length} payments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">₹{totalPending.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{pendingFees.length} enrollments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fee Structures</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{feeStructures.length}</div>
                <p className="text-xs text-muted-foreground">courses configured</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="payments">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="structures">Fee Structures</TabsTrigger>
                <TabsTrigger value="pending">Pending Fees</TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <Button onClick={() => setIsPaymentDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Record Payment
                </Button>
                <Button variant="outline" onClick={() => setIsStructureDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Fee Structure
                </Button>
              </div>
            </div>

            <TabsContent value="payments">
              <PaymentTable data={payments} />
            </TabsContent>

            <TabsContent value="structures">
              <div className="space-y-4">
                {feeStructures.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 border rounded-lg">
                    <p className="text-muted-foreground mb-4">No fee structures configured</p>
                    <Button onClick={() => setIsStructureDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add fee structure
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <div className="p-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Course</th>
                            <th className="text-left py-2">Registration Fee</th>
                            <th className="text-left py-2">Course Fee</th>
                            <th className="text-left py-2">Installments</th>
                            <th className="text-right py-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {feeStructures.map((fs) => (
                            <tr key={fs.id} className="border-b">
                              <td className="py-2">{fs.course.name} ({fs.course.courseCode})</td>
                              <td className="py-2">₹{fs.registrationFee.toLocaleString()}</td>
                              <td className="py-2">₹{fs.courseFee.toLocaleString()}</td>
                              <td className="py-2">
                                {fs.installmentAllowed ? `${fs.installmentCount} installments` : "No"}
                              </td>
                              <td className="py-2 text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteStructure(fs.id)}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="pending">
              <div className="space-y-4">
                {pendingFees.length === 0 ? (
                  <div className="flex items-center justify-center h-64 border rounded-lg">
                    <p className="text-muted-foreground">No pending fees!</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <div className="p-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Student</th>
                            <th className="text-left py-2">Course</th>
                            <th className="text-left py-2">Total Fees</th>
                            <th className="text-left py-2">Paid</th>
                            <th className="text-left py-2">Pending</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingFees.map((pf) => (
                            <tr key={pf.enrollmentId} className="border-b">
                              <td className="py-2">{pf.student.fullName} ({pf.student.studentCode})</td>
                              <td className="py-2">{pf.course.name}</td>
                              <td className="py-2">₹{pf.totalFees.toLocaleString()}</td>
                              <td className="py-2">₹{pf.totalPaid.toLocaleString()}</td>
                              <td className="py-2 font-medium text-orange-600">
                                ₹{pf.pendingAmount.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

      <Dialog open={isStructureDialogOpen} onOpenChange={setIsStructureDialogOpen}>
        <DialogContent className="max-w-lg">
          <FeeStructureForm courses={courses} onSuccess={() => { setIsStructureDialogOpen(false); fetchData() }} />
        </DialogContent>
      </Dialog>

      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <PaymentForm enrollments={enrollments} onSuccess={() => { setIsPaymentDialogOpen(false); fetchData() }} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
