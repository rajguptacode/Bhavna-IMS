# Bhavna Institute IMS - Skills (Development Workflows)

## Overview

Skills are reusable development workflows. Each skill defines a step-by-step process for building a specific feature type. Based on the Development Execution Plan (DEP).

---

## Development Philosophy (MUST FOLLOW)

1. Build foundation first
2. Database before UI
3. Authentication before modules
4. Shared components before screens
5. Student Management is the primary focus
6. Leads support admissions but are secondary

---

## Skill: create-module

**Purpose:** Build a complete CRUD module from scratch

**Steps:**
1. Create Zod validation schema in `src/types/`
2. Create Server Actions in `src/actions/[module].actions.ts`
3. Create form component in `src/components/[module]/`
4. Create table/list component with TanStack Table
5. Create page in `src/app/[module]/`
6. Add routes to sidebar navigation
7. Add permission checks based on RBAC

**Output Files:**
- `src/types/[module].ts`
- `src/actions/[module].actions.ts`
- `src/components/[module]/[Module]Form.tsx`
- `src/components/[module]/[Module]Table.tsx`
- `src/app/[module]/page.tsx`
- `src/app/[module]/[id]/page.tsx`

---

## Skill: create-form

**Purpose:** Build a form with React Hook Form + Zod + shadcn

**Steps:**
1. Define Zod schema
2. Create form component with `useForm`
3. Add `FormField` components
4. Connect to Server Action
5. Handle success/error with Sonner
6. Add permission-based field visibility

**Pattern:**
```typescript
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

export function ModuleForm() {
  const form = useForm({ resolver: zodResolver(schema) })
  
  async function onSubmit(data) {
    const result = await serverAction(data)
    if (result.success) toast.success('Saved!')
    else toast.error('Failed')
  }
}
```

---

## Skill: create-data-table

**Purpose:** Build a data table with TanStack Table + shadcn

**Steps:**
1. Define column definitions
2. Set up TanStack Table instance
3. Add sorting, filtering, pagination
4. Create table header/body components
5. Add search and filter controls
6. Add role-based column visibility

**Pattern:**
```typescript
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
})
```

---

## Skill: create-chart

**Purpose:** Build analytics charts with Recharts

**Steps:**
1. Fetch data from Server Action
2. Transform data for chart
3. Create chart component
4. Add responsive container
5. Add tooltips and legends

**Available Charts:**
- LineChart - Revenue trends
- BarChart - Admission counts
- PieChart - Status distribution
- AreaChart - Attendance trends

---

## Skill: create-server-action

**Purpose:** Build server actions for a module

**Steps:**
1. Create file `src/actions/[module].actions.ts`
2. Add `'use server'` directive
3. Define input types/Zod schemas
4. Implement CRUD functions
5. Add `revalidatePath` for cache invalidation
6. Return `{ success, data/error }` pattern
7. Add permission checks
8. Add audit logging for critical actions

**Pattern:**
```typescript
'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { auth } from '@/lib/auth'

export async function createModule(data: ModuleInput) {
  // 1. Auth check
  const session = await auth()
  if (!session) return { success: false, error: 'Unauthorized' }
  
  // 2. Permission check
  if (!hasPermission(session.user.role, 'CREATE_MODULE')) {
    return { success: false, error: 'Forbidden' }
  }
  
  try {
    // 3. Validate
    const validated = schema.parse(data)
    
    // 4. Create
    const result = await prisma.module.create({ data: validated })
    
    // 5. Audit log
    await logAudit({ action: 'CREATE_MODULE', recordId: result.id })
    
    // 6. Revalidate
    revalidatePath('/module')
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

---

## Skill: create-page

**Purpose:** Build a page with layout and components

**Steps:**
1. Create page file `src/app/[module]/page.tsx`
2. Add PageHeader component
3. Add main content (table/form/dashboard)
4. Server-side data fetching
5. Client-side interactivity
6. Add loading states

**Pattern:**
```tsx
import { PageHeader } from '@/components/layout/page-header'
import { ModuleTable } from '@/components/module/module-table'

export default async function ModulePage() {
  const data = await getData()
  return (
    <>
      <PageHeader title="Module" action={{ label: 'Add New', href: '/module/new' }} />
      <ModuleTable data={data} />
    </>
  )
}
```

---

## Skill: create-layout

**Purpose:** Build shared layout components

**Components:**
- Sidebar with navigation
- Header with search and user menu
- Page wrapper with breadcrumbs

**Navigation Structure:**
```
Dashboard
Students
Courses
Batches
Fees
Attendance
Leads (CRM)
Staff
Reports
Settings
```

---

## Skill: add-validation

**Purpose:** Add Zod validation to existing forms

**Steps:**
1. Define schema with z.object()
2. Add field-level validations
3. Add error messages in Hindi/English
4. Connect to react-hook-form
5. Test validation messages

---

## Skill: create-seed-data

**Purpose:** Create database seed data

**Steps:**
1. Create `prisma/seed.ts`
2. Define seed data for all tables
3. Add roles (Admin, Reception, Counselor, Teacher, Accountant)
4. Add default admin user
5. Add sample courses
6. Add sample students
7. Run `npx prisma db seed`

---

## Skill: create-migration

**Purpose:** Create and apply Prisma migrations

**Steps:**
1. Update `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name [description]`
3. Review generated SQL
4. Test with `npx prisma studio`
5. Commit migration files

**Migration Order:**
1. roles, users, auditLogs
2. courses, staff, batches
3. students, enrollments
4. attendance
5. feeStructures, payments
6. leads, leadActivities

---

## Skill: create-report

**Purpose:** Build a report page with filters and export

**Steps:**
1. Create report page with filters
2. Add date range picker
3. Add filter dropdowns
4. Create data table
5. Add chart visualization
6. Add export button (CSV)
7. Add permission checks

---

## Skill: responsive-design

**Purpose:** Make components mobile responsive

**Steps:**
1. Use Tailwind responsive classes
2. Test on mobile breakpoints (sm, md, lg)
3. Use Sheet component for mobile navigation
4. Stack cards on mobile
5. Hide non-essential columns on mobile

---

## Skill: add-loading-states

**Purpose:** Add loading skeletons and states

**Steps:**
1. Create skeleton components
2. Add loading.tsx for page loading
3. Add Suspense boundaries
4. Add button loading states
5. Add empty states

---

## Skill: add-audit-logging

**Purpose:** Add audit logging for critical actions

**Steps:**
1. Create audit logging utility
2. Add to all create/update/delete actions
3. Store userId, action, module, recordId
4. Store oldValue/newValue for updates
5. Store ipAddress

---

## Skill: add-permission-checks

**Purpose:** Add RBAC permission checks

**Steps:**
1. Create permission utility
2. Define permission matrix
3. Add to all server actions
4. Add to page components (hide/show UI)
5. Add to API routes

**Permission Matrix:**
```
Admin: Full access
Reception: Students, Fees, Leads
Counselor: Leads only
Teacher: Attendance only
Accountant: Fees only
```
