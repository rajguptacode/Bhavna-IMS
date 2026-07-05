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
import { createBatch, updateBatch } from "@/actions/batch.actions"
import { getCourses } from "@/actions/course.actions"
import { getTrainers } from "@/actions/staff.actions"

const batchSchema = z.object({
  batchName: z.string().min(2, "Batch name must be at least 2 characters"),
  courseId: z.string().min(1, "Course is required"),
  trainerId: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  classroom: z.string().optional(),
})

type BatchInput = z.infer<typeof batchSchema>

interface BatchFormProps {
  initialData?: {
    id: string
    batchName: string
    courseId: string
    trainerId: string | null
    startDate: Date
    endDate: Date | null
    capacity: number
    classroom: string | null
  }
  onSuccess?: () => void
}

export function BatchForm({ initialData, onSuccess }: BatchFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [courses, setCourses] = useState<{ id: string; name: string; courseCode: string }[]>([])
  const [trainers, setTrainers] = useState<{ id: string; fullName: string }[]>([])

  const form = useForm<BatchInput>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      batchName: initialData?.batchName || "",
      courseId: initialData?.courseId || "",
      trainerId: initialData?.trainerId || "",
      startDate: initialData?.startDate
        ? new Date(initialData.startDate).toISOString().split("T")[0]
        : "",
      endDate: initialData?.endDate
        ? new Date(initialData.endDate).toISOString().split("T")[0]
        : "",
      capacity: initialData?.capacity || 30,
      classroom: initialData?.classroom || "",
    },
  })

  useEffect(() => {
    async function fetchData() {
      const [coursesResult, trainersResult] = await Promise.all([
        getCourses(),
        getTrainers(),
      ])
      if (coursesResult.success) setCourses(coursesResult.data as { id: string; name: string; courseCode: string }[])
      if (trainersResult.success) setTrainers(trainersResult.data as { id: string; fullName: string }[])
    }
    fetchData()
  }, [])

  async function onSubmit(data: BatchInput) {
    setIsLoading(true)

    try {
      const submitData = {
        ...data,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        trainerId: data.trainerId || undefined,
      }

      const result = initialData
        ? await updateBatch(initialData.id, submitData)
        : await createBatch(submitData)

      if (result.success) {
        toast.success(initialData ? "Batch updated!" : "Batch created!")
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
        <CardTitle>{initialData ? "Edit Batch" : "Create Batch"}</CardTitle>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="batchName">Batch Name *</Label>
            <Input
              id="batchName"
              placeholder="e.g., DCA Morning Batch"
              disabled={isLoading}
              {...form.register("batchName")}
            />
            {form.formState.errors.batchName && (
              <p className="text-sm text-red-500">{form.formState.errors.batchName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Course *</Label>
            <Select
              value={form.watch("courseId")}
              onValueChange={(value) => value && form.setValue("courseId", value)}
              disabled={isLoading}
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

          <div className="space-y-2">
            <Label>Trainer</Label>
            <Select
              value={form.watch("trainerId") || ""}
              onValueChange={(value) => form.setValue("trainerId", value || "")}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select trainer" />
              </SelectTrigger>
              <SelectContent>
                {trainers.map((trainer) => (
                  <SelectItem key={trainer.id} value={trainer.id}>
                    {trainer.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                disabled={isLoading}
                {...form.register("startDate")}
              />
              {form.formState.errors.startDate && (
                <p className="text-sm text-red-500">{form.formState.errors.startDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                disabled={isLoading}
                {...form.register("endDate")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity *</Label>
              <Input
                id="capacity"
                type="number"
                min={1}
                disabled={isLoading}
                {...form.register("capacity", { valueAsNumber: true })}
              />
              {form.formState.errors.capacity && (
                <p className="text-sm text-red-500">{form.formState.errors.capacity.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="classroom">Classroom</Label>
              <Input
                id="classroom"
                placeholder="e.g., Room 101"
                disabled={isLoading}
                {...form.register("classroom")}
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
              "Update Batch"
            ) : (
              "Create Batch"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
