# Bhavna Institute IMS - API Routes & Server Actions

## Authentication

### Auth.js Routes (Auto-generated)
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get session

---

## Server Actions

All mutations use Next.js Server Actions. Located in `src/actions/`.

### Student Actions
- `createStudent(data)` - Create new student
- `updateStudent(id, data)` - Update student
- `getStudent(id)` - Get student by ID
- `getStudents(filters)` - Get all students with filters
- `deleteStudent(id)` - Soft delete (set status INACTIVE)
- `getStudentStats()` - Get student counts by status

### Course Actions
- `createCourse(data)` - Create new course
- `updateCourse(id, data)` - Update course
- `getCourses()` - Get all active courses
- `getCourse(id)` - Get course with fee structure
- `deleteCourse(id)` - Soft delete

### Batch Actions
- `createBatch(data)` - Create new batch
- `updateBatch(id, data)` - Update batch
- `getBatches(filters)` - Get all batches with filters
- `getBatch(id)` - Get batch with enrolled students
- `assignStudentToBatch(batchId, studentId)` - Enroll student
- `removeStudentFromBatch(batchId, studentId)` - Remove enrollment

### Fee Actions
- `createFeeStructure(data)` - Create fee plan for course
- `recordPayment(data)` - Record fee payment
- `getPayments(studentId?)` - Get all payments
- `getPendingFees(studentId?)` - Get pending fee amounts
- `getFeeStats()` - Total revenue, pending, collected

### Attendance Actions
- `markAttendance(data)` - Mark daily attendance
- `getAttendance(batchId, date)` - Get attendance for batch/date
- `getAttendanceReport(studentId, month, year)` - Monthly report
- `getAttendanceStats(batchId)` - Attendance percentages

### Lead Actions
- `createLead(data)` - Create new lead
- `updateLead(id, data)` - Update lead status/info
- `addLeadActivity(leadId, data)` - Add follow-up activity
- `getLeads(filters)` - Get all leads with filters
- `convertLeadToStudent(leadId)` - Convert lead to student
- `getLeadStats()` - Pipeline counts, conversion rate

### Staff Actions
- `createStaff(data)` - Add new staff
- `updateStaff(id, data)` - Update staff info
- `getStaff(filters)` - Get all staff
- `getStaff(id)` - Get staff detail
- `deleteStaff(id)` - Soft delete

### Dashboard Actions
- `getDashboardStats()` - All dashboard metrics
- `getRecentActivity()` - Recent activities feed
- `getRevenueChart(period)` - Revenue data for charts
- `getAdmissionChart(period)` - Admission trends

---

## Data Fetching Patterns

### Server Components (Default)
```typescript
// Direct Prisma queries in server components
import { prisma } from '@/lib/prisma'

export default async function StudentsPage() {
  const students = await prisma.student.findMany()
  return <StudentsTable data={students} />
}
```

### Server Actions (Mutations)
```typescript
// src/actions/student.actions.ts
'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createStudent(data: StudentInput) {
  const student = await prisma.student.create({ data })
  revalidatePath('/students')
  return student
}
```

### Client Components (Interactive)
```typescript
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
```

---

## Validation Rules (Zod)

### Student
- fullName: string, min 2 chars
- mobile: string, 10 digits
- email: email format (optional)
- studentCode: auto-generated (STU-YYYY-XXXX)

### Course
- name: string, required
- courseCode: auto-generated (CRS-XXXX)
- fees: positive number
- duration: positive integer

### Payment
- amount: positive number
- paymentMode: CASH | UPI | BANK_TRANSFER | CARD

### Lead
- fullName: string, required
- mobile: string, 10 digits
- source: LeadSource enum value

---

## Error Handling Pattern

```typescript
// Server Action with error handling
export async function createStudent(data: StudentInput) {
  try {
    // Validate
    const validated = studentSchema.parse(data)
    
    // Create
    const student = await prisma.student.create({ data: validated })
    
    revalidatePath('/students')
    return { success: true, data: student }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors }
    }
    return { success: false, message: 'Failed to create student' }
  }
}
```
