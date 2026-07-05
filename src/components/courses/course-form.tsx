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
import { createCourse, updateCourse } from "@/actions/course.actions"
import { DURATION_TYPE_LABELS } from "@/lib/constants"

const courseSchema = z.object({
  name: z.string().min(2, "Course name must be at least 2 characters"),
  description: z.string().optional(),
  duration: z.number().min(1, "Duration must be at least 1"),
  durationType: z.enum(["DAYS", "WEEKS", "MONTHS"]),
  fees: z.number().min(0, "Fees must be at least 0"),
})

type CourseInput = z.infer<typeof courseSchema>

interface CourseFormProps {
  initialData?: {
    id: string
    name: string
    description: string | null
    duration: number
    durationType: string
    fees: number
  }
  onSuccess?: () => void
}

export function CourseForm({ initialData, onSuccess }: CourseFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<CourseInput>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      duration: initialData?.duration || 1,
      durationType: (initialData?.durationType as "DAYS" | "WEEKS" | "MONTHS") || "MONTHS",
      fees: initialData?.fees || 0,
    },
  })

  async function onSubmit(data: CourseInput) {
    setIsLoading(true)

    try {
      const result = initialData
        ? await updateCourse(initialData.id, data)
        : await createCourse(data)

      if (result.success) {
        toast.success(initialData ? "Course updated!" : "Course created!")
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
        <CardTitle>{initialData ? "Edit Course" : "Create Course"}</CardTitle>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Course Name *</Label>
            <Input
              id="name"
              placeholder="e.g., DCA, Tally, Advanced Excel"
              disabled={isLoading}
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Course description"
              disabled={isLoading}
              {...form.register("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration *</Label>
              <Input
                id="duration"
                type="number"
                min={1}
                disabled={isLoading}
                {...form.register("duration", { valueAsNumber: true })}
              />
              {form.formState.errors.duration && (
                <p className="text-sm text-red-500">{form.formState.errors.duration.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Duration Type *</Label>
              <Select
                value={form.watch("durationType")}
                onValueChange={(value) => form.setValue("durationType", value as "DAYS" | "WEEKS" | "MONTHS")}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DURATION_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fees">Fees (₹) *</Label>
            <Input
              id="fees"
              type="number"
              min={0}
              disabled={isLoading}
              {...form.register("fees", { valueAsNumber: true })}
            />
            {form.formState.errors.fees && (
              <p className="text-sm text-red-500">{form.formState.errors.fees.message}</p>
            )}
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
              "Update Course"
            ) : (
              "Create Course"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
