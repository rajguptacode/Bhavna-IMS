# Bhavna Institute IMS - UI Components Guide

## shadcn/ui Components (Installed)

| Component | File | Usage |
|-----------|------|-------|
| Button | `src/components/ui/button.tsx` | Actions, form submissions |
| Card | `src/components/ui/card.tsx` | Dashboard cards, content containers |
| Table | `src/components/ui/table.tsx` | Data display |
| Dialog | `src/components/ui/dialog.tsx` | Modals, forms |
| Sheet | `src/components/ui/sheet.tsx` | Side panels, mobile navigation |
| Input | `src/components/ui/input.tsx` | Form inputs |
| Label | `src/components/ui/label.tsx` | Form labels |
| Select | `src/components/ui/select.tsx` | Dropdowns |
| Badge | `src/components/ui/badge.tsx` | Status indicators |
| Avatar | `src/components/ui/avatar.tsx` | User avatars |
| Dropdown Menu | `src/components/ui/dropdown-menu.tsx` | Context menus |
| Tabs | `src/components/ui/tabs.tsx` | Tab navigation |
| Tooltip | `src/components/ui/tooltip.tsx` | Hover tooltips |
| Separator | `src/components/ui/separator.tsx` | Visual dividers |

## Components to Add Later

| Component | Usage |
|-----------|-------|
| Calendar | Date picker for attendance, payments |
| Table Pagination | Pagination controls |
| Command | Search command palette |
| Form | React Hook Form integration |
| Popover | Dropdown popovers |
| Toast | (Use Sonner instead) |
| Skeleton | Loading states |

---

## Layout Components (To Build)

### Sidebar (`src/components/layout/sidebar.tsx`)
- Navigation menu
- Collapsible on mobile
- Active state highlighting
- User role display

### Header (`src/components/layout/header.tsx`)
- Search bar
- User dropdown
- Notifications bell
- Mobile menu toggle

### PageHeader (`src/components/layout/page-header.tsx`)
- Page title
- Breadcrumbs
- Action buttons

---

## Module Components (To Build)

### Dashboard
- `StatsCard.tsx` - KPI cards (total students, revenue, etc.)
- `RevenueChart.tsx` - Revenue line/bar chart
- `AdmissionChart.tsx` - Admission trends
- `RecentActivity.tsx` - Activity feed
- `QuickActions.tsx` - Quick action buttons

### Students
- `StudentForm.tsx` - Create/Edit student form
- `StudentTable.tsx` - Student list with TanStack Table
- `StudentProfile.tsx` - Student detail view
- `StudentFilters.tsx` - Search & filter controls

### Courses
- `CourseForm.tsx` - Create/Edit course
- `CourseCard.tsx` - Course display card
- `CourseList.tsx` - Course catalog

### Batches
- `BatchForm.tsx` - Create/Edit batch
- `BatchCard.tsx` - Batch display
- `BatchTimeline.tsx` - Batch schedule view

### Fees
- `FeeStructureForm.tsx` - Fee plan setup
- `PaymentForm.tsx` - Record payment
- `FeeDashboard.tsx` - Fee overview
- `ReceiptCard.tsx` - Payment receipt

### Attendance
- `AttendanceMarking.tsx` - Mark attendance for batch
- `AttendanceCalendar.tsx` - Monthly view
- `AttendanceReport.tsx` - Attendance statistics

### Leads
- `LeadForm.tsx` - Create/Edit lead
- `LeadPipeline.tsx` - Kanban board view
- `LeadTimeline.tsx` - Follow-up history
- `LeadConversion.tsx` - Convert to student

### Staff
- `StaffForm.tsx` - Add/Edit staff
- `StaffTable.tsx` - Staff list

### Reports
- `ReportFilters.tsx` - Date range, filters
- `ReportTable.tsx` - Data table
- `ExportButton.tsx` - Export to CSV/PDF

---

## Design Patterns

### Status Badges
```tsx
// Use consistent colors for statuses
<Badge variant="default">Active</Badge>
<Badge variant="secondary">Inactive</Badge>
<Badge variant="destructive">Dropped</Badge>
<Badge variant="outline">Pending</Badge>
```

### Form Pattern
```tsx
// React Hook Form + Zod + shadcn
<form onSubmit={handleSubmit(onSubmit)}>
  <FormField control={control} name="fullName" render={...} />
  <Button type="submit">Save</Button>
</form>
```

### Data Table Pattern
```tsx
// TanStack Table + shadcn Table
const columns = [
  { accessorKey: 'studentCode', header: 'Code' },
  { accessorKey: 'fullName', header: 'Name' },
  { accessorKey: 'status', header: 'Status' },
]
```
