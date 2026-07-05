import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  CreditCard,
  CheckSquare,
  Target,
  UserCog,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react"
import { ROUTES } from "./constants"

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  permission?: string[]
}

export const mainNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: "Students",
    href: ROUTES.STUDENTS,
    icon: Users,
    permission: ["ADMIN", "RECEPTION", "COUNSELOR", "TEACHER", "ACCOUNTANT"],
  },
  {
    label: "Courses",
    href: ROUTES.COURSES,
    icon: BookOpen,
    permission: ["ADMIN", "RECEPTION", "COUNSELOR", "TEACHER", "ACCOUNTANT"],
  },
  {
    label: "Batches",
    href: ROUTES.BATCHES,
    icon: Calendar,
    permission: ["ADMIN", "RECEPTION", "COUNSELOR", "TEACHER", "ACCOUNTANT"],
  },
  {
    label: "Fees",
    href: ROUTES.FEES,
    icon: CreditCard,
    permission: ["ADMIN", "RECEPTION", "ACCOUNTANT"],
  },
  {
    label: "Attendance",
    href: ROUTES.ATTENDANCE,
    icon: CheckSquare,
    permission: ["ADMIN", "TEACHER", "RECEPTION"],
  },
  {
    label: "Leads (CRM)",
    href: ROUTES.LEADS,
    icon: Target,
    permission: ["ADMIN", "COUNSELOR", "RECEPTION"],
  },
  {
    label: "Staff",
    href: ROUTES.STAFF,
    icon: UserCog,
    permission: ["ADMIN"],
  },
  {
    label: "Reports",
    href: ROUTES.REPORTS,
    icon: BarChart3,
    permission: ["ADMIN", "RECEPTION", "COUNSELOR", "TEACHER", "ACCOUNTANT"],
  },
]

export const settingsNavItems: NavItem[] = [
  {
    label: "Settings",
    href: ROUTES.SETTINGS,
    icon: Settings,
    permission: ["ADMIN"],
  },
]
