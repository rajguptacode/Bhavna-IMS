"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { createPayment } from "@/actions/fee.actions"
import { PAYMENT_MODE_LABELS } from "@/lib/constants"

const paymentSchema = z.object({
  enrollmentId: z.string().min(1, "Enrollment is required"),
  amount: z.number().min(1, "Amount must be at least 1"),
  paymentDate: z.string().min(1, "Payment date is required"),
  paymentMode: z.enum(["CASH", "UPI", "BANK_TRANSFER", "CARD", "CHEQUE"]),
  transactionReference: z.string().optional(),
  remarks: z.string().optional(),
})

type PaymentInput = z.infer<typeof paymentSchema>

interface Enrollment {
  id: string
  student: { id: string; fullName: string; studentCode: string }
  course: { name: string; fees: number }
  batch: { batchName: string }
  payments: { amount: number }[]
}

interface PaymentFormProps {
  enrollments: Enrollment[]
  onSuccess?: () => void
}

export function PaymentForm({ enrollments, onSuccess }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<PaymentInput>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      enrollmentId: "",
      amount: 0,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMode: "CASH",
      transactionReference: "",
      remarks: "",
    },
  })

  const selectedEnrollmentId = form.watch("enrollmentId")
  const selectedEnrollment = enrollments.find((e) => e.id === selectedEnrollmentId)

  async function onSubmit(data: PaymentInput) {
    setIsLoading(true)
    try {
      const result = await createPayment({
        ...data,
        studentId: selectedEnrollment?.student.id || "",
        paymentDate: new Date(data.paymentDate),
      })
      if (result.success) {
        toast.success("Payment recorded!")
        form.reset()
        onSuccess?.()
      } else {
        toast.error(result.error || "Failed to record payment")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Payment</CardTitle>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Student / Enrollment *</Label>
            <Select
              value={form.watch("enrollmentId")}
              onValueChange={(value) => value && form.setValue("enrollmentId", value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select student enrollment" />
              </SelectTrigger>
              <SelectContent>
                {enrollments.map((enrollment) => {
                  const totalPaid = enrollment.payments.reduce((sum, p) => sum + p.amount, 0)
                  const pending = enrollment.course.fees - totalPaid
                  return (
                    <SelectItem key={enrollment.id} value={enrollment.id}>
                      {enrollment.student.fullName} ({enrollment.student.studentCode}) - {enrollment.course.name} - Pending: ₹{pending.toLocaleString()}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            {form.formState.errors.enrollmentId && (
              <p className="text-sm text-red-500">{form.formState.errors.enrollmentId.message}</p>
            )}
          </div>

          {selectedEnrollment && (
            <div className="rounded-md bg-gray-50 p-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">Course:</span> {selectedEnrollment.course.name}</div>
                <div><span className="text-muted-foreground">Batch:</span> {selectedEnrollment.batch.batchName}</div>
                <div><span className="text-muted-foreground">Total Fees:</span> ₹{selectedEnrollment.course.fees.toLocaleString()}</div>
                <div>
                  <span className="text-muted-foreground">Already Paid:</span> ₹{selectedEnrollment.payments.reduce((s, p) => s + p.amount, 0).toLocaleString()}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹) *</Label>
              <Input
                id="amount"
                type="number"
                min={1}
                disabled={isLoading}
                {...form.register("amount", { valueAsNumber: true })}
              />
              {form.formState.errors.amount && (
                <p className="text-sm text-red-500">{form.formState.errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentDate">Payment Date *</Label>
              <Input
                id="paymentDate"
                type="date"
                disabled={isLoading}
                {...form.register("paymentDate")}
              />
              {form.formState.errors.paymentDate && (
                <p className="text-sm text-red-500">{form.formState.errors.paymentDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Payment Mode *</Label>
            <Select
              value={form.watch("paymentMode")}
              onValueChange={(value) => form.setValue("paymentMode", value as PaymentInput["paymentMode"])}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PAYMENT_MODE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transactionReference">Transaction Reference</Label>
            <Input
              id="transactionReference"
              placeholder="UPI ID / Cheque No / Transaction ID"
              disabled={isLoading}
              {...form.register("transactionReference")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              placeholder="Additional notes"
              disabled={isLoading}
              {...form.register("remarks")}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Recording...
              </>
            ) : (
              "Record Payment"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
