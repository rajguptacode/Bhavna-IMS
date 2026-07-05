"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { StaffTable } from "@/components/staff/staff-table"
import { StaffForm } from "@/components/staff/staff-form"
import { getStaff, deleteStaff } from "@/actions/staff.actions"

interface Staff {
  id: string
  employeeCode: string
  fullName: string
  designation: string
  mobile: string
  email: string | null
  joiningDate: Date
  salary: number | null
  status: string
}

export default function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)

  async function fetchStaff() {
    const result = await getStaff()
    if (result.success) {
      setStaffList(result.data as Staff[])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStaff()
  }, [])

  function handleEdit(staff: Staff) {
    setEditingStaff(staff)
    setIsDialogOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this staff member?")) return

    const result = await deleteStaff(id)
    if (result.success) {
      toast.success("Staff deleted!")
      fetchStaff()
    } else {
      toast.error(result.error || "Failed to delete staff")
    }
  }

  function handleSuccess() {
    setIsDialogOpen(false)
    setEditingStaff(null)
    fetchStaff()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Staff</h1>
          <p className="text-muted-foreground">Manage institute staff members</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading staff...</p>
        </div>
      ) : staffList.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border rounded-lg">
          <p className="text-muted-foreground mb-4">No staff members found</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add your first staff member
          </Button>
        </div>
      ) : (
        <StaffTable data={staffList} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <StaffForm
            initialData={editingStaff || undefined}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
