# Bhavna Institute IMS - AI Agent Definitions

## Overview

Each module has a dedicated AI agent that understands the module's domain, schema, and requirements. Use these agents to generate code for specific modules.

---

## RBAC Rules (Must Follow)

| Module | Admin | Reception | Counselor | Teacher | Accountant |
|--------|-------|-----------|-----------|---------|------------|
| Dashboard | Full | Limited | Limited | Limited | Limited |
| Students | CRUD | CRUD | View | View | View |
| Courses | CRUD | View | View | View | View |
| Batches | CRUD | View | View | View | View |
| Attendance | CRUD | View | View | CRUD | View |
| Payments | CRUD | CRUD | No Access | View | CRUD |
| Leads | CRUD | CRUD | CRUD | No Access | No Access |
| Reports | CRUD | Limited | Limited | Limited | Limited |
| Staff | CRUD | No Access | No Access | No Access | No Access |
| Users | CRUD | No Access | No Access | No Access | No Access |
| Settings | CRUD | No Access | No Access | No Access | No Access |

**NEVER bypass permission checks. NEVER hardcode role permissions.**

---

## Agent: auth-agent

**Purpose:** Handle authentication, roles, and permissions

**Context Files:**
- `prisma/schema.prisma` (Role, User models)
- `docs/security.md` (RBAC rules)
- `src/lib/auth.ts`

**Responsibilities:**
- Auth.js configuration with Prisma adapter
- Login/Register pages
- Session management (8 hours default, 30 days remember me)
- Role-based access control (RBAC)
- Middleware for protected routes
- Password hashing (Argon2/bcrypt)
- Audit logging for auth events

**Permission Rules:**
- All APIs require authentication
- All actions require role validation
- Passwords minimum 8 characters
- Track failed logins, password changes

**Can Generate:**
- Auth configuration
- Login form with validation
- Protected route middleware
- Role permission checks
- Audit log entries

---

## Agent: student-agent

**Purpose:** Student management module

**Context Files:**
- `prisma/schema.prisma` (Student, Enrollment models)
- `docs/er.md` (Student relationships)
- `docs/api.md` (Student APIs)
- `docs/data directory.md` (Student fields)

**Responsibilities:**
- Student CRUD operations
- Student profile page
- Student search & filters
- Student status management (ACTIVE, COMPLETED, INACTIVE, DROPPED, ALUMNI)
- Enrollment linking
- Soft delete (never permanently delete students)

**Permission Rules:**
- Admin: Full CRUD
- Reception: Full CRUD
- Counselor: View only
- Teacher: View only
- Accountant: View only

**API Endpoints:**
- GET /students (filters: page, limit, search, status)
- GET /students/:id
- POST /students (Admin, Reception)
- PATCH /students/:id (Admin, Reception)
- DELETE /students/:id (Admin only - soft delete)

**Can Generate:**
- Student form (create/edit)
- Student table with filters
- Student profile page
- Server actions for students
- Zod validation schemas

---

## Agent: course-agent

**Purpose:** Course management module

**Context Files:**
- `prisma/schema.prisma` (Course, FeeStructure models)
- `docs/ddd.md` (Course module)
- `docs/api.md` (Course APIs)

**Responsibilities:**
- Course CRUD operations
- Course catalog
- Fee structure linking
- Duration management (DAYS, WEEKS, MONTHS)

**Permission Rules:**
- Admin: Full CRUD
- All others: View only

**API Endpoints:**
- GET /courses (All authenticated users)
- POST /courses (Admin)
- PATCH /courses/:id (Admin)
- DELETE /courses/:id (Admin)

**Can Generate:**
- Course form
- Course card/list
- Fee structure form
- Server actions for courses

---

## Agent: batch-agent

**Purpose:** Batch management module

**Context Files:**
- `prisma/schema.prisma` (Batch, Enrollment models)
- `docs/er.md` (Batch relationships)
- `docs/api.md` (Batch APIs)

**Responsibilities:**
- Batch CRUD operations
- Student assignment to batches
- Trainer assignment
- Capacity management
- Batch scheduling
- Status tracking (UPCOMING, ACTIVE, COMPLETED, CANCELLED)

**Permission Rules:**
- Admin: Full CRUD
- Reception: View + Assign students
- Others: View only

**API Endpoints:**
- GET /batches (All authenticated users)
- POST /batches (Admin)
- PATCH /batches/:id (Admin)
- POST /batches/:id/students (Admin, Reception)

**Can Generate:**
- Batch form
- Batch card with student list
- Enrollment management
- Server actions for batches

---

## Agent: fee-agent

**Purpose:** Fee management and payments

**Context Files:**
- `prisma/schema.prisma` (FeeStructure, Payment models)
- `docs/ddd.md` (Fee module)
- `docs/api.md` (Fee APIs)
- `docs/data directoryv2.md` (Fee fields)

**Responsibilities:**
- Fee structure management
- Payment recording
- Receipt generation
- Pending fee tracking
- Revenue calculations
- Payment modes: CASH, UPI, BANK_TRANSFER, CARD, CHEQUE

**Permission Rules:**
- Admin: Full CRUD
- Accountant: Full CRUD
- Reception: Full CRUD
- Teacher: View only
- Counselor: No Access

**API Endpoints:**
- GET /fees (Admin, Accountant, Reception)
- POST /payments (Admin, Accountant, Reception)
- GET /payments/student/:studentId (Admin, Accountant, Reception)
- GET /fees/pending (Admin, Accountant)

**Validation:**
- Amount must be > 0
- Student must exist
- Enrollment must exist

**Can Generate:**
- Payment form
- Fee dashboard
- Receipt template
- Fee report components
- Server actions for fees

---

## Agent: attendance-agent

**Purpose:** Attendance tracking and reporting

**Context Files:**
- `prisma/schema.prisma` (Attendance model)
- `docs/ddd.md` (Attendance module)
- `docs/api.md` (Attendance APIs)

**Responsibilities:**
- Daily attendance marking
- Attendance reports
- Attendance statistics
- Monthly views
- Status: PRESENT, ABSENT, LATE, LEAVE

**Permission Rules:**
- Admin: Full CRUD
- Teacher: Full CRUD
- Reception: View only
- Others: View only

**API Endpoints:**
- POST /attendance (Teacher, Admin)
- GET /attendance (Teacher, Admin, Reception - filters: date, batch, student)
- GET /attendance/report (Teacher, Admin)

**Unique Constraint:**
- (studentId, attendanceDate) - prevents duplicate attendance

**Can Generate:**
- Attendance marking form
- Attendance calendar view
- Attendance report component
- Server actions for attendance

---

## Agent: lead-agent

**Purpose:** Lead CRM and pipeline management

**Context Files:**
- `prisma/schema.prisma` (Lead, LeadActivity models)
- `docs/er.md` (Lead relationships, conversion flow)
- `docs/api.md` (Lead APIs)

**Responsibilities:**
- Lead CRUD operations
- Lead status pipeline
- Follow-up activities
- Lead conversion to student
- Lead analytics
- Sources: WEBSITE, WALK_IN, WHATSAPP, FACEBOOK, INSTAGRAM, REFERRAL, CALL, OTHER
- Status: NEW, CONTACTED, INTERESTED, DEMO_SCHEDULED, ADMISSION_PENDING, CONVERTED, LOST

**Permission Rules:**
- Admin: Full CRUD
- Counselor: Full CRUD
- Reception: Full CRUD
- Teacher: No Access
- Accountant: No Access

**API Endpoints:**
- GET /leads (Admin, Counselor, Reception - filters: status, source)
- POST /leads (Admin, Counselor, Reception)
- PATCH /leads/:id (Admin, Counselor)
- POST /leads/:id/activity (Admin, Counselor)
- POST /leads/:id/convert (Admin, Counselor)

**Lead Conversion Flow:**
1. Create Student
2. Create Enrollment
3. Update Lead Status = CONVERTED
4. Archive Lead

**Can Generate:**
- Lead form
- Lead pipeline (Kanban)
- Activity timeline
- Lead conversion flow
- Server actions for leads

---

## Agent: staff-agent

**Purpose:** Staff management

**Context Files:**
- `prisma/schema.prisma` (Staff model)
- `docs/ddd.md` (Staff module)
- `docs/api.md` (Staff APIs)
- `docs/data directoryv2.md` (Staff fields)

**Responsibilities:**
- Staff CRUD operations
- Role/designation management
- Staff listing
- Designations: ADMIN, TEACHER, COUNSELOR, RECEPTION, ACCOUNTANT
- Status: ACTIVE, INACTIVE, RESIGNED, TERMINATED

**Permission Rules:**
- Admin: Full CRUD
- All others: No Access

**API Endpoints:**
- GET /staff (Admin only)
- POST /staff (Admin only)
- PATCH /staff/:id (Admin only)

**Can Generate:**
- Staff form
- Staff table
- Server actions for staff

---

## Agent: dashboard-agent

**Purpose:** Dashboard and analytics

**Context Files:**
- `docs/ddd.md` (Dashboard Metrics section)
- `docs/api.md` (Dashboard APIs)
- `docs/COMPONENTS.md` (Dashboard components)

**Responsibilities:**
- Dashboard stats cards
- Revenue charts
- Admission trends
- Recent activity feed
- Quick actions

**Metrics (derived from database):**
- Total Students
- Active Students
- New Admissions
- Total Leads
- Converted Leads
- Pending Fees
- Revenue
- Attendance Percentage

**Permission Rules:**
- All authenticated users (limited based on role)

**API Endpoint:**
- GET /dashboard (All authenticated users)

**Can Generate:**
- Stats card components
- Recharts configurations
- Dashboard layout
- Server actions for dashboard metrics

---

## Agent: layout-agent

**Purpose:** App layout, navigation, and shared components

**Context Files:**
- `docs/COMPONENTS.md` (Layout section)
- `docs/TECH_STACK.md` (Project structure)
- `docs/security.md` (Route protection)

**Responsibilities:**
- Sidebar navigation
- Header component
- Page layout wrapper
- Breadcrumbs
- Mobile responsiveness
- Route protection middleware

**Public Routes:**
- Login
- Forgot Password

**Protected Routes:**
- Dashboard, Students, Attendance, Fees, Reports, etc.

**Can Generate:**
- Sidebar component
- Header component
- Page layout
- Navigation configuration
- Middleware for route protection

---

## Agent: report-agent

**Purpose:** Reports and data export

**Context Files:**
- `docs/api.md` (Report APIs)
- `docs/COMPONENTS.md` (Report components)

**Responsibilities:**
- Student reports
- Admission reports
- Fee reports
- Attendance reports
- Data export (CSV/PDF)

**Permission Rules:**
- Admin: Full access
- Others: Limited based on role

**API Endpoints:**
- GET /reports/students (Admin)
- GET /reports/fees (Admin, Accountant)
- GET /reports/attendance (Admin, Teacher)
- GET /reports/admissions (Admin)

**Can Generate:**
- Report components
- Filter controls
- Export utilities
- Chart configurations

---

## Agent: audit-agent

**Purpose:** Audit logging for security

**Context Files:**
- `docs/security.md` (Audit logging section)
- `docs/data directoryv2.md` (auditLogs table)

**Responsibilities:**
- Log critical actions
- Track user actions
- Store old/new values for changes

**Actions to Log:**
- CREATE_STUDENT, UPDATE_STUDENT, DELETE_STUDENT
- CREATE_PAYMENT, CONVERT_LEAD
- CREATE_BATCH, UPDATE_COURSE
- User creation/deletion
- Permission changes
- Failed logins

**Audit Log Fields:**
- userId, action, module, recordId
- oldValue, newValue (JSON)
- ipAddress, createdAt

**Can Generate:**
- Audit logging utility
- Audit log viewer
- Middleware for tracking

---

## Agent: schema-agent

**Purpose:** Database schema management and migrations

**Context Files:**
- `prisma/schema.prisma`
- `docs/ddd.md`
- `docs/er.md`
- `docs/data directory.md`
- `docs/data directoryv2.md`

**Responsibilities:**
- Schema updates
- Migration generation
- Seed data creation
- Database queries

**Migration Plan:**
1. Migration 1: roles, users, auditLogs
2. Migration 2: courses, staff, batches
3. Migration 3: students, enrollments
4. Migration 4: attendance
5. Migration 5: feeStructures, payments
6. Migration 6: leads, leadActivities

**Can Generate:**
- Prisma schema changes
- Migration files
- Seed scripts
- Complex queries
