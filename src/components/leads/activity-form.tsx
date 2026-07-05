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
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { createLeadActivity, getUsers } from "@/actions/lead.actions"
import { ACTIVITY_TYPE_LABELS } from "@/lib/constants"

const activitySchema = z.object({
  activityType: z.enum(["CALL", "WHATSAPP", "EMAIL", "VISIT", "DEMO", "MEETING", "OTHER"]),
  notes: z.string().min(1, "Notes are required"),
  nextFollowUp: z.string().optional(),
  createdBy: z.string().min(1, "User is required"),
})

type ActivityInput = z.infer<typeof activitySchema>

interface ActivityFormProps {
  leadId: string
  onSuccess?: () => void
}

export function ActivityForm({ leadId, onSuccess }: ActivityFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<{ id: string; fullName: string }[]>([])

  const form = useForm<ActivityInput>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      activityType: "CALL",
      notes: "",
      nextFollowUp: "",
      createdBy: "",
    },
  })

  useEffect(() => {
    getUsers().then((result) => {
      if (result.success) setUsers(result.data as { id: string; fullName: string }[])
    })
  }, [])

  async function onSubmit(data: ActivityInput) {
    setIsLoading(true)
    try {
      const result = await createLeadActivity({
        leadId,
        activityType: data.activityType,
        notes: data.notes,
        nextFollowUp: data.nextFollowUp ? new Date(data.nextFollowUp) : undefined,
        createdBy: data.createdBy,
      })

      if (result.success) {
        toast.success("Activity logged!")
        onSuccess?.()
      } else {
        toast.error(result.error || "Failed to log activity")
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
        <CardTitle>Log Activity</CardTitle>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Activity Type *</Label>
            <Select
              value={form.watch("activityType")}
              onValueChange={(v) => v && form.setValue("activityType", v as ActivityInput["activityType"])}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ACTIVITY_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes *</Label>
            <Textarea
              id="notes"
              placeholder="Describe the activity..."
              disabled={isLoading}
              {...form.register("notes")}
            />
            {form.formState.errors.notes && (
              <p className="text-sm text-red-500">{form.formState.errors.notes.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextFollowUp">Next Follow-Up</Label>
            <Input
              id="nextFollowUp"
              type="datetime-local"
              disabled={isLoading}
              {...form.register("nextFollowUp")}
            />
          </div>

          <div className="space-y-2">
            <Label>Logged By *</Label>
            <Select
              value={form.watch("createdBy")}
              onValueChange={(v) => v && form.setValue("createdBy", v)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>{user.fullName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Log Activity"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
