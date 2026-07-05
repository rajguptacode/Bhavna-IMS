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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { createStaff, updateStaff } from "@/actions/staff.actions"
import { STAFF_DESIGNATION_LABELS } from "@/lib/constants"

const staffSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  designation: z.enum(["ADMIN", "TEACHER", "COUNSELOR", "RECEPTION", "ACCOUNTANT"]),
  mobile: z.string().min(10, "Mobile must be at least 10 digits"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  joiningDate: z.string().min(1, "Joining date is required"),
  salary: z.number().min(0).optional(),
})

type StaffInput = z.infer<typeof staffSchema>

interface StaffFormProps {
  initialData?: {
    id: string
    fullName: string
    designation: string
    mobile: string
    email: string | null
    joiningDate: Date
    salary: number | null
  }
  onSuccess?: () => void
}

export function StaffForm({ initialData, onSuccess }: StaffFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<StaffInput>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      designation: (initialData?.designation as StaffInput["designation"]) || "TEACHER",
      mobile: initialData?.mobile || "",
      email: initialData?.email || "",
      joiningDate: initialData?.joiningDate
        ? new Date(initialData.joiningDate).toISOString().split("T")[0]
        : "",
      salary: initialData?.salary || 0,
    },
  })

  async function onSubmit(data: StaffInput) {
    setIsLoading(true)

    try {
      const submitData = {
        ...data,
        joiningDate: new Date(data.joiningDate),
        email: data.email || undefined,
      }

      const result = initialData
        ? await updateStaff(initialData.id, submitData)
        : await createStaff(submitData)

      if (result.success) {
        toast.success(initialData ? "Staff updated!" : "Staff created!")
        onSuccess?.()
      } else {
        toast.error(result.error || "Something went wrong")
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
        <CardTitle>{initialData ? "Edit Staff" : "Add Staff"}</CardTitle>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="Enter full name"
              disabled={isLoading}
              {...form.register("fullName")}
            />
            {form.formState.errors.fullName && (
              <p className="text-sm text-red-500">{form.formState.errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Designation *</Label>
            <Select
              value={form.watch("designation")}
              onValueChange={(value) => form.setValue("designation", value as StaffInput["designation"])}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select designation" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STAFF_DESIGNATION_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile *</Label>
              <Input
                id="mobile"
                placeholder="10-digit mobile number"
                disabled={isLoading}
                {...form.register("mobile")}
              />
              {form.formState.errors.mobile && (
                <p className="text-sm text-red-500">{form.formState.errors.mobile.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                disabled={isLoading}
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="joiningDate">Joining Date *</Label>
              <Input
                id="joiningDate"
                type="date"
                disabled={isLoading}
                {...form.register("joiningDate")}
              />
              {form.formState.errors.joiningDate && (
                <p className="text-sm text-red-500">{form.formState.errors.joiningDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salary (₹)</Label>
              <Input
                id="salary"
                type="number"
                min={0}
                disabled={isLoading}
                {...form.register("salary", { valueAsNumber: true })}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : initialData ? (
              "Update Staff"
            ) : (
              "Add Staff"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
