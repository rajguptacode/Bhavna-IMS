# Bhavna Institute IMS - AI Agent Definitions

## Overview

Each module has a dedicated AI agent that understands the module's domain, schema, and requirements. Use these agents to generate code for specific modules.

---

## Agent: auth-agent

**Purpose:** Handle authentication, roles, and permissions

**Context Files:**
- `prisma/schema.prisma` (Role, User models)
- `src/lib/auth.ts`
- `docs/API.md` (Auth section)

**Responsibilities:**
- Auth.js configuration with Prisma adapter
- Login/Register pages
- Session management
- Role-based access control (RBAC)
- Middleware for protected routes

**Can Generate:**
- Auth configuration
- Login form with validation
- Protected route middleware
- Role permission checks

---

## Agent: student-agent

**Purpose:** Student management module

**Context Files:**
- `prisma/schema.prisma` (Student, Enrollment models)
- `docs/ER.md` (Student relationships)
- `docs/API.md` (Student Actions)

**Responsibilities:**
- Student CRUD operations
- Student profile page
- Student search & filters
- Student status management
- Enrollment linking

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
- `docs/DDD.md` (Course module)
- `docs/API.md` (Course Actions)

**Responsibilities:**
- Course CRUD operations
- Course catalog
- Fee structure linking
- Duration management

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
- `docs/ER.md` (Batch relationships)
- `docs/API.md` (Batch Actions)

**Responsibilities:**
- Batch CRUD operations
- Student assignment to batches
- Trainer assignment
- Capacity management
- Batch scheduling

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
- `docs/DDD.md` (Fee module)
- `docs/API.md` (Fee Actions)

**Responsibilities:**
- Fee structure management
- Payment recording
- Receipt generation
- Pending fee tracking
- Revenue calculations

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
- `docs/DDD.md` (Attendance module)
- `docs/API.md` (Attendance Actions)

**Responsibilities:**
- Daily attendance marking
- Attendance reports
- Attendance statistics
- Monthly views

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
- `docs/ER.md` (Lead relationships, conversion flow)
- `docs/API.md` (Lead Actions)

**Responsibilities:**
- Lead CRUD operations
- Lead status pipeline
- Follow-up activities
- Lead conversion to student
- Lead analytics

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
- `docs/DDD.md` (Staff module)
- `docs/API.md` (Staff Actions)

**Responsibilities:**
- Staff CRUD operations
- Role/designation management
- Staff listing

**Can Generate:**
- Staff form
- Staff table
- Server actions for staff

---

## Agent: dashboard-agent

**Purpose:** Dashboard and analytics

**Context Files:**
- `docs/DDD.md` (Dashboard Metrics section)
- `docs/API.md` (Dashboard Actions)
- `docs/COMPONENTS.md` (Dashboard components)

**Responsibilities:**
- Dashboard stats cards
- Revenue charts
- Admission trends
- Recent activity feed
- Quick actions

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

**Responsibilities:**
- Sidebar navigation
- Header component
- Page layout wrapper
- Breadcrumbs
- Mobile responsiveness

**Can Generate:**
- Sidebar component
- Header component
- Page layout
- Navigation configuration

---

## Agent: report-agent

**Purpose:** Reports and data export

**Context Files:**
- `docs/API.md` (All actions)
- `docs/COMPONENTS.md` (Report components)

**Responsibilities:**
- Student reports
- Admission reports
- Fee reports
- Attendance reports
- Data export (CSV/PDF)

**Can Generate:**
- Report components
- Filter controls
- Export utilities
- Chart configurations

---

## Agent: schema-agent

**Purpose:** Database schema management and migrations

**Context Files:**
- `prisma/schema.prisma`
- `docs/DDD.md`
- `docs/ER.md`

**Responsibilities:**
- Schema updates
- Migration generation
- Seed data creation
- Database queries

**Can Generate:**
- Prisma schema changes
- Migration files
- Seed scripts
- Complex queries
