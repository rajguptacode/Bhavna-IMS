"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { StudentTable } from "@/components/students/student-table"
import { StudentForm } from "@/components/students/student-form"
import { getStudents, deleteStudent } from "@/actions/student.actions"

interface Student {
  id: string
  studentCode: string
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
  status: string
  _count: {
    enrollments: number
    payments: number
  }
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)

  async function fetchStudents() {
    const result = await getStudents()
    if (result.success) {
      setStudents(result.data as Student[])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStudents()
  }, [])

  function handleEdit(student: Student) {
    setEditingStudent(student)
    setIsDialogOpen(true)
  }

  function handleView(student: Student) {
    setEditingStudent(student)
    setIsDialogOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to deactivate this student?")) return

    const result = await deleteStudent(id)
    if (result.success) {
      toast.success("Student deactivated!")
      fetchStudents()
    } else {
      toast.error(result.error || "Failed to deactivate student")
    }
  }

  function handleSuccess() {
    setIsDialogOpen(false)
    setEditingStudent(null)
    fetchStudents()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">Manage institute students</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading students...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border rounded-lg">
          <p className="text-muted-foreground mb-4">No students found</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add your first student
          </Button>
        </div>
      ) : (
        <StudentTable
          data={students}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <StudentForm
            initialData={editingStudent || undefined}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
