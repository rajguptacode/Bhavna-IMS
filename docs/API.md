# Bhavna Institute IMS - API Specification v1.0

## Overview

Base URL: `/api/v1`
Authentication: JWT Session Authentication
Content Type: `application/json`

**Total MVP APIs: 38**

---

## Authentication APIs (3)

### POST /auth/login
**Purpose:** Authenticate user
**Permissions:** Public
**Request:**
```json
{
  "email": "admin@bhavnaims.com",
  "password": "password"
}
```
**Response:**
```json
{
  "success": true,
  "token": "jwt-token",
  "user": {}
}
```

### POST /auth/logout
**Purpose:** End current session
**Permissions:** Authenticated Users

### GET /auth/me
**Purpose:** Get logged in user
**Permissions:** Authenticated Users

---

## Student Module (5 APIs)

### GET /students
**Purpose:** Fetch all students
**Permissions:** Admin, Reception, Teacher
**Filters:** ?page= ?limit= ?search= ?status=
**Response:**
```json
{
  "data": [],
  "total": 0
}
```

### GET /students/:id
**Purpose:** Fetch student details
**Permissions:** Admin, Reception, Teacher

### POST /students
**Purpose:** Create student record
**Permissions:** Admin, Reception
**Request:**
```json
{
  "fullName": "",
  "mobile": "",
  "courseId": "",
  "batchId": ""
}
```

### PATCH /students/:id
**Purpose:** Update student
**Permissions:** Admin, Reception

### DELETE /students/:id
**Purpose:** Soft delete student
**Permissions:** Admin

---

## Course Module (4 APIs)

### GET /courses
**Purpose:** Get all courses
**Permissions:** All Authenticated Users

### POST /courses
**Purpose:** Create course
**Permissions:** Admin

### PATCH /courses/:id
**Purpose:** Update course
**Permissions:** Admin

### DELETE /courses/:id
**Purpose:** Delete course
**Permissions:** Admin

---

## Batch Module (4 APIs)

### GET /batches
**Purpose:** Get all batches
**Permissions:** All Authenticated Users

### POST /batches
**Purpose:** Create batch
**Permissions:** Admin

### PATCH /batches/:id
**Purpose:** Update batch
**Permissions:** Admin

### POST /batches/:id/students
**Purpose:** Assign student to batch
**Permissions:** Admin, Reception
**Request:**
```json
{
  "studentId": ""
}
```

---

## Enrollment Module (2 APIs)

### POST /enrollments
**Purpose:** Enroll student into course
**Permissions:** Admin, Reception

### GET /enrollments/:id
**Purpose:** Get enrollment details
**Permissions:** Admin, Reception

---

## Attendance Module (3 APIs)

### POST /attendance
**Purpose:** Mark attendance
**Permissions:** Teacher, Admin
**Request:**
```json
{
  "studentId": "",
  "batchId": "",
  "status": "Present"
}
```

### GET /attendance
**Purpose:** Get attendance records
**Permissions:** Teacher, Admin, Reception
**Filters:** ?date= ?batch= ?student=

### GET /attendance/report
**Purpose:** Monthly attendance report
**Permissions:** Teacher, Admin

---

## Fee Module (4 APIs)

### GET /fees
**Purpose:** Fee dashboard
**Permissions:** Admin, Accountant, Reception

### POST /payments
**Purpose:** Record payment
**Permissions:** Admin, Accountant, Reception
**Request:**
```json
{
  "studentId": "",
  "amount": 5000,
  "paymentMode": "UPI"
}
```

### GET /payments/student/:studentId
**Purpose:** Student payment history
**Permissions:** Admin, Accountant, Reception

### GET /fees/pending
**Purpose:** Pending fees
**Permissions:** Admin, Accountant

---

## Lead CRM (5 APIs)

### GET /leads
**Purpose:** Get all leads
**Permissions:** Admin, Counselor, Reception
**Filters:** ?status= ?source=

### POST /leads
**Purpose:** Create lead
**Permissions:** Admin, Counselor, Reception

### PATCH /leads/:id
**Purpose:** Update lead
**Permissions:** Admin, Counselor

### POST /leads/:id/activity
**Purpose:** Add lead activity
**Permissions:** Admin, Counselor
**Request:**
```json
{
  "activityType": "Call",
  "notes": "Interested in DCA"
}
```

### POST /leads/:id/convert
**Purpose:** Convert lead to student
**Permissions:** Admin, Counselor
**System Actions:**
1. Create Student
2. Create Enrollment
3. Update Lead Status = Converted

---

## Staff Module (3 APIs)

### GET /staff
**Purpose:** Get all staff
**Permissions:** Admin

### POST /staff
**Purpose:** Create staff
**Permissions:** Admin

### PATCH /staff/:id
**Purpose:** Update staff
**Permissions:** Admin

---

## Reports Module (4 APIs)

### GET /reports/students
**Purpose:** Student report
**Permissions:** Admin

### GET /reports/fees
**Purpose:** Fee report
**Permissions:** Admin, Accountant

### GET /reports/attendance
**Purpose:** Attendance report
**Permissions:** Admin, Teacher

### GET /reports/admissions
**Purpose:** Admission report
**Permissions:** Admin

---

## Dashboard API (1)

### GET /dashboard
**Purpose:** Dashboard overview
**Permissions:** All Authenticated Users
**Response:**
```json
{
  "totalStudents": 0,
  "activeStudents": 0,
  "todayAdmissions": 0,
  "pendingFees": 0,
  "newLeads": 0,
  "todayRevenue": 0
}
```

---

## Validation Rules

- Student Mobile: Must be unique
- Course Code: Must be unique
- Batch Code: Must be unique
- Attendance: One record per student per day
- Payments: Amount must be > 0

---

## Error Format

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

## Server Actions (Alternative to API Routes)

Instead of REST APIs, use Next.js Server Actions:

```typescript
'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createStudent(data: StudentInput) {
  const student = await prisma.student.create({ data })
  revalidatePath('/students')
  return student
}
```

**Benefits:**
- No separate API routes needed
- Type-safe
- Simpler code
- Automatic cache revalidation
