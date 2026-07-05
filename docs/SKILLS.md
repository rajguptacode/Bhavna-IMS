# Bhavna Institute IMS - Skills (Development Workflows)

## Overview

Skills are reusable development workflows. Each skill defines a step-by-step process for building a specific feature type.

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

**Pattern:**
```typescript
'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export async function createModule(data: ModuleInput) {
  try {
    const validated = schema.parse(data)
    const result = await prisma.module.create({ data: validated })
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
3. Add roles (Admin, Reception, etc.)
4. Add sample courses
5. Add sample students
6. Run `npx prisma db seed`

---

## Skill: create-migration

**Purpose:** Create and apply Prisma migrations

**Steps:**
1. Update `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name [description]`
3. Review generated SQL
4. Test with `npx prisma studio`
5. Commit migration files

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
