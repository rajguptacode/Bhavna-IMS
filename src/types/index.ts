import { type Role } from "@/lib/constants"

// ==========================================
// AUTH TYPES
// ==========================================

export interface UserSession {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: Role
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ==========================================
// FORM TYPES
// ==========================================

export interface FormState {
  success: boolean
  error?: string
  message?: string
}

// ==========================================
// STUDENT TYPES
// ==========================================

export interface StudentInput {
  fullName: string
  fatherName?: string
  motherName?: string
  mobile: string
  email?: string
  gender?: "MALE" | "FEMALE" | "OTHER"
  dob?: Date
  address?: string
  city?: string
  state?: string
  pincode?: string
  admissionDate?: Date
  remarks?: string
}

export interface StudentWithRelations {
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
  photoUrl: string | null
  status: string
  remarks: string | null
  createdAt: Date
  updatedAt: Date
  enrollments?: EnrollmentWithRelations[]
  payments?: PaymentWithRelations[]
}

// ==========================================
// COURSE TYPES
// ==========================================

export interface CourseInput {
  name: string
  description?: string
  duration: number
  durationType: "DAYS" | "WEEKS" | "MONTHS"
  fees: number
}

export interface CourseWithRelations {
  id: string
  courseCode: string
  name: string
  description: string | null
  duration: number
  durationType: string
  fees: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  batches?: BatchWithRelations[]
  feeStructure?: FeeStructureWithRelations
}

// ==========================================
// BATCH TYPES
// ==========================================

export interface BatchInput {
  batchName: string
  courseId: string
  trainerId?: string
  startDate: Date
  endDate?: Date
  capacity: number
  classroom?: string
}

export interface BatchWithRelations {
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
  createdAt: Date
  updatedAt: Date
  course?: CourseWithRelations
  trainer?: StaffWithRelations
  enrollments?: EnrollmentWithRelations[]
}

// ==========================================
// ENROLLMENT TYPES
// ==========================================

export interface EnrollmentInput {
  studentId: string
  courseId: string
  batchId: string
}

export interface EnrollmentWithRelations {
  id: string
  studentId: string
  courseId: string
  batchId: string
  enrollmentDate: Date
  completionDate: Date | null
  status: string
  createdAt: Date
  updatedAt: Date
  student?: StudentWithRelations
  course?: CourseWithRelations
  batch?: BatchWithRelations
}

// ==========================================
// STAFF TYPES
// ==========================================

export interface StaffInput {
  fullName: string
  designation: "ADMIN" | "TEACHER" | "COUNSELOR" | "RECEPTION" | "ACCOUNTANT"
  mobile: string
  email?: string
  joiningDate: Date
  salary?: number
}

export interface StaffWithRelations {
  id: string
  employeeCode: string
  fullName: string
  designation: string
  mobile: string
  email: string | null
  joiningDate: Date
  salary: number | null
  status: string
  createdAt: Date
  updatedAt: Date
  batches?: BatchWithRelations[]
}

// ==========================================
// FEE TYPES
// ==========================================

export interface FeeStructureInput {
  courseId: string
  registrationFee: number
  courseFee: number
  installmentAllowed: boolean
  installmentCount?: number
}

export interface FeeStructureWithRelations {
  id: string
  courseId: string
  registrationFee: number
  courseFee: number
  installmentAllowed: boolean
  installmentCount: number | null
  createdAt: Date
  updatedAt: Date
  course?: CourseWithRelations
}

// ==========================================
// PAYMENT TYPES
// ==========================================

export interface PaymentInput {
  studentId: string
  enrollmentId: string
  amount: number
  paymentMode: "CASH" | "UPI" | "BANK_TRANSFER" | "CARD" | "CHEQUE"
  transactionReference?: string
  remarks?: string
}

export interface PaymentWithRelations {
  id: string
  studentId: string
  enrollmentId: string
  amount: number
  paymentDate: Date
  paymentMode: string
  transactionReference: string | null
  remarks: string | null
  collectedBy: string | null
  createdAt: Date
  updatedAt: Date
  student?: StudentWithRelations
  enrollment?: EnrollmentWithRelations
}

// ==========================================
// ATTENDANCE TYPES
// ==========================================

export interface AttendanceInput {
  studentId: string
  batchId: string
  attendanceDate: Date
  status: "PRESENT" | "ABSENT" | "LEAVE" | "LATE"
  remarks?: string
}

export interface AttendanceWithRelations {
  id: string
  studentId: string
  batchId: string
  attendanceDate: Date
  status: string
  remarks: string | null
  createdAt: Date
  updatedAt: Date
  student?: StudentWithRelations
  batch?: BatchWithRelations
}

// ==========================================
// LEAD TYPES
// ==========================================

export interface LeadInput {
  fullName: string
  mobile: string
  email?: string
  source: "WEBSITE" | "WALK_IN" | "WHATSAPP" | "FACEBOOK" | "INSTAGRAM" | "REFERRAL" | "CALL" | "OTHER"
  assignedTo?: string
  remarks?: string
}

export interface LeadWithRelations {
  id: string
  leadCode: string
  fullName: string
  mobile: string
  email: string | null
  source: string
  status: string
  assignedTo: string | null
  remarks: string | null
  createdAt: Date
  updatedAt: Date
  activities?: LeadActivityWithRelations[]
}

// ==========================================
// LEAD ACTIVITY TYPES
// ==========================================

export interface LeadActivityInput {
  activityType: "CALL" | "WHATSAPP" | "EMAIL" | "VISIT" | "DEMO" | "MEETING" | "OTHER"
  notes: string
  nextFollowUp?: Date
}

export interface LeadActivityWithRelations {
  id: string
  leadId: string
  activityType: string
  notes: string
  nextFollowUp: Date | null
  createdBy: string
  createdAt: Date
  lead?: LeadWithRelations
  creator?: {
    id: string
    fullName: string
    email: string
  }
}

// ==========================================
// DASHBOARD TYPES
// ==========================================

export interface DashboardStats {
  totalStudents: number
  activeStudents: number
  todayAdmissions: number
  pendingFees: number
  newLeads: number
  todayRevenue: number
  totalCourses: number
  activeBatches: number
}

// ==========================================
// REPORT TYPES
// ==========================================

export interface ReportFilters {
  startDate?: Date
  endDate?: Date
  courseId?: string
  batchId?: string
  status?: string
}

export interface StudentReport {
  totalStudents: number
  activeStudents: number
  newAdmissions: number
  statusDistribution: Record<string, number>
}

export interface FeeReport {
  totalRevenue: number
  pendingAmount: number
  collectedAmount: number
  paymentModeDistribution: Record<string, number>
}

export interface AttendanceReport {
  totalDays: number
  presentDays: number
  absentDays: number
  leaveDays: number
  lateDays: number
  percentage: number
}
