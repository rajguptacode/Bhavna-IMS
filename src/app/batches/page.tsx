"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { BatchTable } from "@/components/batches/batch-table"
import { BatchForm } from "@/components/batches/batch-form"
import { getBatches, deleteBatch } from "@/actions/batch.actions"

interface Batch {
  id: string
  batchCode: string
  batchName: string
  courseId: string
  trainerId: string | null
  startDate: Date
  endDate: Date | null
  capacity: number
  classroom: string | null
  status: string
  course: {
    name: string
  }
  trainer: {
    fullName: string
  } | null
  _count: {
    enrollments: number
  }
}

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null)

  async function fetchBatches() {
    const result = await getBatches()
    if (result.success) {
      setBatches(result.data as Batch[])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBatches()
  }, [])

  function handleEdit(batch: Batch) {
    setEditingBatch(batch)
    setIsDialogOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this batch?")) return

    const result = await deleteBatch(id)
    if (result.success) {
      toast.success("Batch deleted!")
      fetchBatches()
    } else {
      toast.error(result.error || "Failed to delete batch")
    }
  }

  function handleSuccess() {
    setIsDialogOpen(false)
    setEditingBatch(null)
    fetchBatches()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Batches</h1>
          <p className="text-muted-foreground">Manage institute batches</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Batch
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading batches...</p>
        </div>
      ) : batches.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border rounded-lg">
          <p className="text-muted-foreground mb-4">No batches found</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create your first batch
          </Button>
        </div>
      ) : (
        <BatchTable data={batches} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <BatchForm
            initialData={editingBatch || undefined}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
