"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ROLE_LABELS } from "@/lib/constants"
import { Shield, User, Key } from "lucide-react"

export default function SettingsPage() {
  const { data: session } = useSession()
  const user = session?.user as { name?: string; email?: string; role?: string } | undefined

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and system settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={user?.name || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <div>
                <Badge className="bg-blue-100 text-blue-800">
                  {user?.role ? ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] || user.role : "Unknown"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              System Information
            </CardTitle>
            <CardDescription>Application details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Application</Label>
              <Input value="Bhavna Institute IMS" disabled />
            </div>
            <div className="space-y-2">
              <Label>Version</Label>
              <Input value="0.1.0" disabled />
            </div>
            <div className="space-y-2">
              <Label>Tech Stack</Label>
              <Input value="Next.js 16, Prisma, PostgreSQL" disabled />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Password and security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Password changes and two-factor authentication will be available in a future update.
            </p>
            <Button variant="outline" disabled>
              Change Password (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard" className="block">
              <Button variant="outline" className="w-full justify-start">Go to Dashboard</Button>
            </Link>
            <Link href="/reports" className="block">
              <Button variant="outline" className="w-full justify-start">View Reports</Button>
            </Link>
            <Link href="/students" className="block">
              <Button variant="outline" className="w-full justify-start">Manage Students</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
