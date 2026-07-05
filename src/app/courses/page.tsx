"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { CourseTable } from "@/components/courses/course-table"
import { CourseForm } from "@/components/courses/course-form"
import { getCourses, deleteCourse } from "@/actions/course.actions"

interface Course {
  id: string
  courseCode: string
  name: string
  description: string | null
  duration: number
  durationType: string
  fees: number
  isActive: boolean
  _count: {
    batches: number
    enrollments: number
  }
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  async function fetchCourses() {
    const result = await getCourses()
    if (result.success) {
      setCourses(result.data as Course[])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCourses()
  }, [])

  function handleEdit(course: Course) {
    setEditingCourse(course)
    setIsDialogOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this course?")) return

    const result = await deleteCourse(id)
    if (result.success) {
      toast.success("Course deleted!")
      fetchCourses()
    } else {
      toast.error(result.error || "Failed to delete course")
    }
  }

  function handleSuccess() {
    setIsDialogOpen(false)
    setEditingCourse(null)
    fetchCourses()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground">Manage institute courses</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border rounded-lg">
          <p className="text-muted-foreground mb-4">No courses found</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create your first course
          </Button>
        </div>
      ) : (
        <CourseTable data={courses} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <CourseForm
            initialData={editingCourse || undefined}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
