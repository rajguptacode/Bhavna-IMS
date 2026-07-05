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
import { createLead, updateLead } from "@/actions/lead.actions"
import { LEAD_SOURCE_LABELS, LEAD_STATUS_LABELS } from "@/lib/constants"

const leadFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z.string().min(10, "Mobile must be at least 10 digits"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  source: z.enum(["WEBSITE", "WALK_IN", "WHATSAPP", "FACEBOOK", "INSTAGRAM", "REFERRAL", "CALL", "OTHER"]),
  status: z.enum(["NEW", "CONTACTED", "INTERESTED", "DEMO_SCHEDULED", "ADMISSION_PENDING", "CONVERTED", "LOST"]).optional(),
  remarks: z.string().optional(),
})

type LeadFormInput = z.infer<typeof leadFormSchema>

interface LeadFormProps {
  initialData?: {
    id: string
    fullName: string
    mobile: string
    email: string | null
    source: string
    status: string
    remarks: string | null
  }
  onSuccess?: () => void
}

export function LeadForm({ initialData, onSuccess }: LeadFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LeadFormInput>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      mobile: initialData?.mobile || "",
      email: initialData?.email || "",
      source: (initialData?.source as LeadFormInput["source"]) || "WALK_IN",
      status: (initialData?.status as LeadFormInput["status"]) || "NEW",
      remarks: initialData?.remarks || "",
    },
  })

  async function onSubmit(data: LeadFormInput) {
    setIsLoading(true)
    try {
      const result = initialData
        ? await updateLead(initialData.id, data)
        : await createLead(data)

      if (result.success) {
        toast.success(initialData ? "Lead updated!" : "Lead created!")
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
        <CardTitle>{initialData ? "Edit Lead" : "Add Lead"}</CardTitle>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="Enter lead name"
              disabled={isLoading}
              {...form.register("fullName")}
            />
            {form.formState.errors.fullName && (
              <p className="text-sm text-red-500">{form.formState.errors.fullName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile *</Label>
              <Input
                id="mobile"
                placeholder="10-digit mobile"
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
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Source *</Label>
              <Select
                value={form.watch("source")}
                onValueChange={(v) => v && form.setValue("source", v as LeadFormInput["source"])}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LEAD_SOURCE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {initialData && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.watch("status")}
                  onValueChange={(v) => v && form.setValue("status", v as LeadFormInput["status"])}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              placeholder="Notes about this lead"
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
              "Update Lead"
            ) : (
              "Add Lead"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
