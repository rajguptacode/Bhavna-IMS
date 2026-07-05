// ==========================================
// ROLES
// ==========================================

export const ROLES = {
  ADMIN: "ADMIN",
  RECEPTION: "RECEPTION",
  COUNSELOR: "COUNSELOR",
  TEACHER: "TEACHER",
  ACCOUNTANT: "ACCOUNTANT",
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Admin",
  RECEPTION: "Reception",
  COUNSELOR: "Counselor",
  TEACHER: "Teacher",
  ACCOUNTANT: "Accountant",
}

// ==========================================
// STUDENT STATUS
// ==========================================

export const STUDENT_STATUS = {
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  INACTIVE: "INACTIVE",
  DROPPED: "DROPPED",
  ALUMNI: "ALUMNI",
} as const

export type StudentStatus = (typeof STUDENT_STATUS)[keyof typeof STUDENT_STATUS]

export const STUDENT_STATUS_LABELS: Record<StudentStatus, string> = {
  ACTIVE: "Active",
  COMPLETED: "Completed",
  INACTIVE: "Inactive",
  DROPPED: "Dropped",
  ALUMNI: "Alumni",
}

export const STUDENT_STATUS_COLORS: Record<StudentStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  INACTIVE: "bg-gray-100 text-gray-800",
  DROPPED: "bg-red-100 text-red-800",
  ALUMNI: "bg-purple-100 text-purple-800",
}

// ==========================================
// GENDER
// ==========================================

export const GENDER = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
} as const

export type Gender = (typeof GENDER)[keyof typeof GENDER]

export const GENDER_LABELS: Record<Gender, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
}

// ==========================================
// COURSE DURATION TYPE
// ==========================================

export const DURATION_TYPE = {
  DAYS: "DAYS",
  WEEKS: "WEEKS",
  MONTHS: "MONTHS",
} as const

export type DurationType = (typeof DURATION_TYPE)[keyof typeof DURATION_TYPE]

export const DURATION_TYPE_LABELS: Record<DurationType, string> = {
  DAYS: "Days",
  WEEKS: "Weeks",
  MONTHS: "Months",
}

// ==========================================
// BATCH STATUS
// ==========================================

export const BATCH_STATUS = {
  UPCOMING: "UPCOMING",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const

export type BatchStatus = (typeof BATCH_STATUS)[keyof typeof BATCH_STATUS]

export const BATCH_STATUS_LABELS: Record<BatchStatus, string> = {
  UPCOMING: "Upcoming",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
}

export const BATCH_STATUS_COLORS: Record<BatchStatus, string> = {
  UPCOMING: "bg-yellow-100 text-yellow-800",
  ACTIVE: "bg-green-100 text-green-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  CANCELLED: "bg-red-100 text-red-800",
}

// ==========================================
// ENROLLMENT STATUS
// ==========================================

export const ENROLLMENT_STATUS = {
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  DROPPED: "DROPPED",
  TRANSFERRED: "TRANSFERRED",
} as const

export type EnrollmentStatus = (typeof ENROLLMENT_STATUS)[keyof typeof ENROLLMENT_STATUS]

export const ENROLLMENT_STATUS_LABELS: Record<EnrollmentStatus, string> = {
  ACTIVE: "Active",
  COMPLETED: "Completed",
  DROPPED: "Dropped",
  TRANSFERRED: "Transferred",
}

// ==========================================
// STAFF DESIGNATION
// ==========================================

export const STAFF_DESIGNATION = {
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
  COUNSELOR: "COUNSELOR",
  RECEPTION: "RECEPTION",
  ACCOUNTANT: "ACCOUNTANT",
} as const

export type StaffDesignation = (typeof STAFF_DESIGNATION)[keyof typeof STAFF_DESIGNATION]

export const STAFF_DESIGNATION_LABELS: Record<StaffDesignation, string> = {
  ADMIN: "Admin",
  TEACHER: "Teacher",
  COUNSELOR: "Counselor",
  RECEPTION: "Reception",
  ACCOUNTANT: "Accountant",
}

export const STAFF_DESIGNATION_COLORS: Record<StaffDesignation, string> = {
  ADMIN: "bg-purple-100 text-purple-800",
  TEACHER: "bg-blue-100 text-blue-800",
  COUNSELOR: "bg-orange-100 text-orange-800",
  RECEPTION: "bg-green-100 text-green-800",
  ACCOUNTANT: "bg-yellow-100 text-yellow-800",
}

// ==========================================
// STAFF STATUS
// ==========================================

export const STAFF_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  RESIGNED: "RESIGNED",
  TERMINATED: "TERMINATED",
} as const

export type StaffStatus = (typeof STAFF_STATUS)[keyof typeof STAFF_STATUS]

export const STAFF_STATUS_LABELS: Record<StaffStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  RESIGNED: "Resigned",
  TERMINATED: "Terminated",
}

// ==========================================
// PAYMENT MODE
// ==========================================

export const PAYMENT_MODE = {
  CASH: "CASH",
  UPI: "UPI",
  BANK_TRANSFER: "BANK_TRANSFER",
  CARD: "CARD",
  CHEQUE: "CHEQUE",
} as const

export type PaymentMode = (typeof PAYMENT_MODE)[keyof typeof PAYMENT_MODE]

export const PAYMENT_MODE_LABELS: Record<PaymentMode, string> = {
  CASH: "Cash",
  UPI: "UPI",
  BANK_TRANSFER: "Bank Transfer",
  CARD: "Card",
  CHEQUE: "Cheque",
}

// ==========================================
// ATTENDANCE STATUS
// ==========================================

export const ATTENDANCE_STATUS = {
  PRESENT: "PRESENT",
  ABSENT: "ABSENT",
  LEAVE: "LEAVE",
  LATE: "LATE",
} as const

export type AttendanceStatus = (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS]

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  PRESENT: "Present",
  ABSENT: "Absent",
  LEAVE: "Leave",
  LATE: "Late",
}

export const ATTENDANCE_STATUS_COLORS: Record<AttendanceStatus, string> = {
  PRESENT: "bg-green-100 text-green-800",
  ABSENT: "bg-red-100 text-red-800",
  LEAVE: "bg-yellow-100 text-yellow-800",
  LATE: "bg-orange-100 text-orange-800",
}

// ==========================================
// LEAD SOURCE
// ==========================================

export const LEAD_SOURCE = {
  WEBSITE: "WEBSITE",
  WALK_IN: "WALK_IN",
  WHATSAPP: "WHATSAPP",
  FACEBOOK: "FACEBOOK",
  INSTAGRAM: "INSTAGRAM",
  REFERRAL: "REFERRAL",
  CALL: "CALL",
  OTHER: "OTHER",
} as const

export type LeadSource = (typeof LEAD_SOURCE)[keyof typeof LEAD_SOURCE]

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  WEBSITE: "Website",
  WALK_IN: "Walk-In",
  WHATSAPP: "WhatsApp",
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
  REFERRAL: "Referral",
  CALL: "Call",
  OTHER: "Other",
}

// ==========================================
// LEAD STATUS
// ==========================================

export const LEAD_STATUS = {
  NEW: "NEW",
  CONTACTED: "CONTACTED",
  INTERESTED: "INTERESTED",
  DEMO_SCHEDULED: "DEMO_SCHEDULED",
  ADMISSION_PENDING: "ADMISSION_PENDING",
  CONVERTED: "CONVERTED",
  LOST: "LOST",
} as const

export type LeadStatus = (typeof LEAD_STATUS)[keyof typeof LEAD_STATUS]

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  INTERESTED: "Interested",
  DEMO_SCHEDULED: "Demo Scheduled",
  ADMISSION_PENDING: "Admission Pending",
  CONVERTED: "Converted",
  LOST: "Lost",
}

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  NEW: "bg-blue-100 text-blue-800",
  CONTACTED: "bg-yellow-100 text-yellow-800",
  INTERESTED: "bg-orange-100 text-orange-800",
  DEMO_SCHEDULED: "bg-purple-100 text-purple-800",
  ADMISSION_PENDING: "bg-indigo-100 text-indigo-800",
  CONVERTED: "bg-green-100 text-green-800",
  LOST: "bg-red-100 text-red-800",
}

// ==========================================
// ACTIVITY TYPE
// ==========================================

export const ACTIVITY_TYPE = {
  CALL: "CALL",
  WHATSAPP: "WHATSAPP",
  EMAIL: "EMAIL",
  VISIT: "VISIT",
  DEMO: "DEMO",
  MEETING: "MEETING",
  OTHER: "OTHER",
} as const

export type ActivityType = (typeof ACTIVITY_TYPE)[keyof typeof ACTIVITY_TYPE]

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  CALL: "Call",
  WHATSAPP: "WhatsApp",
  EMAIL: "Email",
  VISIT: "Visit",
  DEMO: "Demo",
  MEETING: "Meeting",
  OTHER: "Other",
}

// ==========================================
// ROUTES
// ==========================================

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  STUDENTS: "/students",
  STUDENT_DETAIL: "/students",
  COURSES: "/courses",
  BATCHES: "/batches",
  FEES: "/fees",
  ATTENDANCE: "/attendance",
  LEADS: "/leads",
  STAFF: "/staff",
  REPORTS: "/reports",
  SETTINGS: "/settings",
} as const

// ==========================================
// APP INFO
// ==========================================

export const APP_NAME = "Bhavna Institute IMS"
export const APP_DESCRIPTION = "Institute Management System for Bhavna Institute"
