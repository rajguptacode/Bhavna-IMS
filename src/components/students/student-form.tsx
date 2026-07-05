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
import { createStudent, updateStudent } from "@/actions/student.actions"
import { GENDER_LABELS } from "@/lib/constants"

const studentSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  mobile: z.string().min(10, "Mobile must be at least 10 digits"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  dob: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  admissionDate: z.string().min(1, "Admission date is required"),
  remarks: z.string().optional(),
})

type StudentInput = z.infer<typeof studentSchema>

interface StudentFormProps {
  initialData?: {
    id: string
    fullName: string
    fatherName: string | null
    motherName: string | null
    mobile: string
    email: string | null
    gender: string | null
    dob: Date | null
    address: string | null
    city: string | null
    state: string | null
    pincode: string | null
    admissionDate: Date
    remarks: string | null
  }
  onSuccess?: () => void
}

export function StudentForm({ initialData, onSuccess }: StudentFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<StudentInput>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      fatherName: initialData?.fatherName || "",
      motherName: initialData?.motherName || "",
      mobile: initialData?.mobile || "",
      email: initialData?.email || "",
      gender: (initialData?.gender as StudentInput["gender"]) || undefined,
      dob: initialData?.dob
        ? new Date(initialData.dob).toISOString().split("T")[0]
        : "",
      address: initialData?.address || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      pincode: initialData?.pincode || "",
      admissionDate: initialData?.admissionDate
        ? new Date(initialData.admissionDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      remarks: initialData?.remarks || "",
    },
  })

  async function onSubmit(data: StudentInput) {
    setIsLoading(true)

    try {
      const submitData = {
        ...data,
        dob: data.dob ? new Date(data.dob) : undefined,
        admissionDate: new Date(data.admissionDate),
      }

      const result = initialData
        ? await updateStudent(initialData.id, submitData)
        : await createStudent(submitData)

      if (result.success) {
        toast.success(initialData ? "Student updated!" : "Student created!")
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
        <CardTitle>{initialData ? "Edit Student" : "Add Student"}</CardTitle>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fatherName">Father Name</Label>
              <Input
                id="fatherName"
                placeholder="Father's name"
                disabled={isLoading}
                {...form.register("fatherName")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motherName">Mother Name</Label>
              <Input
                id="motherName"
                placeholder="Mother's name"
                disabled={isLoading}
                {...form.register("motherName")}
              />
            </div>
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

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                value={form.watch("gender") || ""}
                onValueChange={(value) => form.setValue("gender", value as StudentInput["gender"])}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(GENDER_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                disabled={isLoading}
                {...form.register("dob")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admissionDate">Admission Date *</Label>
              <Input
                id="admissionDate"
                type="date"
                disabled={isLoading}
                {...form.register("admissionDate")}
              />
              {form.formState.errors.admissionDate && (
                <p className="text-sm text-red-500">{form.formState.errors.admissionDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              placeholder="Full address"
              disabled={isLoading}
              {...form.register("address")}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="City"
                disabled={isLoading}
                {...form.register("city")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                placeholder="State"
                disabled={isLoading}
                {...form.register("state")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                placeholder="6-digit pincode"
                disabled={isLoading}
                {...form.register("pincode")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              placeholder="Any additional notes"
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
                Saving...
              </>
            ) : initialData ? (
              "Update Student"
            ) : (
              "Add Student"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
