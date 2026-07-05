"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Target, Users, TrendingUp, Clock } from "lucide-react"
import { LeadTable } from "@/components/leads/lead-table"
import { LeadForm } from "@/components/leads/lead-form"
import { ActivityForm } from "@/components/leads/activity-form"
import { getLeads, deleteLead, updateLeadStatus, getLeadById } from "@/actions/lead.actions"
import { LEAD_STATUS_LABELS } from "@/lib/constants"

interface Lead {
  id: string
  leadCode: string
  fullName: string
  mobile: string
  email: string | null
  source: string
  status: string
  remarks: string | null
  createdAt: Date
  _count: { activities: number }
  activities: { nextFollowUp: Date | null }[]
}

interface LeadDetail extends Lead {
  activities: {
    id: string
    activityType: string
    notes: string
    nextFollowUp: Date | null
    createdAt: Date
    creator: { fullName: string }
  }[]
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [selectedLeadId, setSelectedLeadId] = useState("")
  const [leadDetail, setLeadDetail] = useState<LeadDetail | null>(null)

  async function fetchLeads() {
    const result = await getLeads()
    if (result.success) {
      setLeads(result.data as Lead[])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLeads()
  }, [])

  function handleEdit(lead: Lead) {
    setEditingLead(lead)
    setIsFormDialogOpen(true)
  }

  function handleLogActivity(lead: Lead) {
    setSelectedLeadId(lead.id)
    setIsActivityDialogOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this lead and all its activities?")) return
    const result = await deleteLead(id)
    if (result.success) {
      toast.success("Lead deleted!")
      fetchLeads()
    } else {
      toast.error(result.error || "Failed to delete lead")
    }
  }

  async function handleStatusChange(id: string, status: string) {
    const result = await updateLeadStatus(id, status)
    if (result.success) {
      toast.success(`Lead marked as ${LEAD_STATUS_LABELS[status as keyof typeof LEAD_STATUS_LABELS]}`)
      fetchLeads()
    } else {
      toast.error(result.error || "Failed to update status")
    }
  }

  function handleSuccess() {
    setIsFormDialogOpen(false)
    setIsActivityDialogOpen(false)
    setEditingLead(null)
    setSelectedLeadId("")
    fetchLeads()
  }

  const totalLeads = leads.length
  const convertedLeads = leads.filter((l) => l.status === "CONVERTED").length
  const pendingLeads = leads.filter((l) => l.status !== "CONVERTED" && l.status !== "LOST").length
  const followUpDue = leads.filter(
    (l) => l.activities[0]?.nextFollowUp && new Date(l.activities[0].nextFollowUp) <= new Date()
  ).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lead CRM</h1>
          <p className="text-muted-foreground">Manage and track leads through the pipeline</p>
        </div>
        <Button onClick={() => setIsFormDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading leads...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalLeads}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Pipeline</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingLeads}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Converted</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{convertedLeads}</div>
                <p className="text-xs text-muted-foreground">
                  {totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0}% conversion rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Follow-Up Due</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{followUpDue}</div>
              </CardContent>
            </Card>
          </div>

          <LeadTable
            data={leads}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onLogActivity={handleLogActivity}
            onStatusChange={handleStatusChange}
          />
        </>
      )}

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-w-2xl">
          <LeadForm initialData={editingLead || undefined} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog open={isActivityDialogOpen} onOpenChange={setIsActivityDialogOpen}>
        <DialogContent className="max-w-lg">
          <ActivityForm leadId={selectedLeadId} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
