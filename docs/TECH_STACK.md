# Bhavna Institute IMS - Tech Stack

## Frontend

| Tool | Version | Purpose |
|------|---------|---------|
| Next.js | 16 | React framework with App Router |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first styling |
| shadcn/ui | Latest | UI component library |
| Lucide React | Latest | Icons |

## Backend

| Tool | Purpose |
|------|---------|
| Next.js Server Actions | API layer (no separate backend) |
| Prisma ORM | Database access |
| PostgreSQL | Primary database (Neon) |

## Authentication

| Tool | Purpose |
|------|---------|
| Auth.js (NextAuth v5) | Session management, RBAC |
| @auth/prisma-adapter | Prisma integration |

## Forms & Validation

| Tool | Purpose |
|------|---------|
| React Hook Form | Form management |
| Zod | Schema validation |

## Data Tables

| Tool | Purpose |
|------|---------|
| TanStack Table | Sorting, filtering, pagination |

## Charts & Analytics

| Tool | Purpose |
|------|---------|
| Recharts | Revenue, admission, attendance charts |

## Notifications

| Tool | Purpose |
|------|---------|
| Sonner | Toast notifications |

## File Uploads

| Phase | Tool |
|-------|------|
| Phase 1 | Local uploads |
| Phase 2 | Cloudinary |

## Deployment

| Service | Purpose |
|---------|---------|
| Vercel | Frontend + API hosting |
| Neon PostgreSQL | Database hosting |

## Package Manager

| Tool | Reason |
|------|--------|
| npm | Stable, widely supported |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Auth pages (login, register)
│   ├── dashboard/          # Dashboard
│   ├── students/           # Student management
│   ├── courses/            # Course management
│   ├── batches/            # Batch management
│   ├── fees/               # Fee management
│   ├── attendance/         # Attendance management
│   ├── leads/              # Lead CRM
│   ├── staff/              # Staff management
│   ├── reports/            # Reports & analytics
│   ├── settings/           # Settings
│   └── api/                # API routes
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Layout components (sidebar, header)
│   ├── dashboard/          # Dashboard components
│   ├── students/           # Student components
│   ├── courses/            # Course components
│   ├── batches/            # Batch components
│   ├── fees/               # Fee components
│   ├── attendance/         # Attendance components
│   ├── leads/              # Lead components
│   ├── staff/              # Staff components
│   └── reports/            # Report components
├── lib/
│   ├── utils.ts            # cn() utility
│   ├── prisma.ts           # Prisma client singleton
│   └── auth.ts             # Auth.js config
├── actions/                # Server Actions
│   ├── student.actions.ts
│   ├── course.actions.ts
│   ├── batch.actions.ts
│   ├── fee.actions.ts
│   ├── attendance.actions.ts
│   ├── lead.actions.ts
│   └── staff.actions.ts
├── types/                  # TypeScript types
│   └── index.ts
├── hooks/                  # Custom React hooks
└── generated/prisma/       # Prisma generated client (gitignored)
```
