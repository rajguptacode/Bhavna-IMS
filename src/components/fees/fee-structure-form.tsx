"use client"

import { useState, useEffect } from "react"
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
import { upsertFeeStructure } from "@/actions/fee.actions"
import { getCourses } from "@/actions/course.actions"

const feeSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  registrationFee: z.number().min(0),
  courseFee: z.number().min(1, "Course fee must be at least 1"),
  installmentAllowed: z.boolean(),
  installmentCount: z.number().min(1).optional(),
})

type FeeInput = z.infer<typeof feeSchema>

interface FeeStructureFormProps {
  courses: { id: string; name: string; courseCode: string }[]
  initialData?: {
    id: string
    courseId: string
    registrationFee: number
    courseFee: number
    installmentAllowed: boolean
    installmentCount: number | null
  }
  onSuccess?: () => void
}

export function FeeStructureForm({ courses, initialData, onSuccess }: FeeStructureFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FeeInput>({
    resolver: zodResolver(feeSchema),
    defaultValues: {
      courseId: initialData?.courseId || "",
      registrationFee: initialData?.registrationFee || 0,
      courseFee: initialData?.courseFee || 0,
      installmentAllowed: initialData?.installmentAllowed || false,
      installmentCount: initialData?.installmentCount || 3,
    },
  })

  const installmentAllowed = form.watch("installmentAllowed")

  async function onSubmit(data: FeeInput) {
    setIsLoading(true)
    try {
      const result = await upsertFeeStructure(data)
      if (result.success) {
        toast.success("Fee structure saved!")
        onSuccess?.()
      } else {
        toast.error(result.error || "Failed to save")
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
        <CardTitle>{initialData ? "Edit Fee Structure" : "Add Fee Structure"}</CardTitle>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Course *</Label>
            <Select
              value={form.watch("courseId")}
              onValueChange={(value) => value && form.setValue("courseId", value)}
              disabled={isLoading || !!initialData}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name} ({course.courseCode})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.courseId && (
              <p className="text-sm text-red-500">{form.formState.errors.courseId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="registrationFee">Registration Fee (₹) *</Label>
              <Input
                id="registrationFee"
                type="number"
                min={0}
                disabled={isLoading}
                {...form.register("registrationFee", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseFee">Course Fee (₹) *</Label>
              <Input
                id="courseFee"
                type="number"
                min={1}
                disabled={isLoading}
                {...form.register("courseFee", { valueAsNumber: true })}
              />
              {form.formState.errors.courseFee && (
                <p className="text-sm text-red-500">{form.formState.errors.courseFee.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="installmentAllowed"
                className="h-4 w-4"
                disabled={isLoading}
                {...form.register("installmentAllowed")}
              />
              <Label htmlFor="installmentAllowed">Allow Installments</Label>
            </div>
          </div>

          {installmentAllowed && (
            <div className="space-y-2">
              <Label htmlFor="installmentCount">Number of Installments *</Label>
              <Input
                id="installmentCount"
                type="number"
                min={1}
                max={12}
                disabled={isLoading}
                {...form.register("installmentCount", { valueAsNumber: true })}
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Fee Structure"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
