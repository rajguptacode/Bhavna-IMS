# Bhavna Institute IMS

Institute Management System for Bhavna Institute - digitizing admissions, student management, attendance, fee collection, and reporting.

## Tech Stack

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js Server Actions, Prisma ORM
- **Database:** PostgreSQL (Neon)
- **Auth:** Auth.js (NextAuth v5)
- **Forms:** React Hook Form + Zod
- **Tables:** TanStack Table
- **Charts:** Recharts

## Features

- **Dashboard** - Institute overview with stats and charts
- **Student Management** - Registration, profiles, enrollment
- **Course Management** - Course catalog, fee structure
- **Batch Management** - Batch creation, student assignment
- **Fee Management** - Fee plans, payment collection, receipts
- **Attendance** - Daily marking, monthly reports
- **Lead CRM** - Lead pipeline, follow-ups, conversion
- **Staff Management** - Staff records, roles
- **Reports** - Student, admission, fee, attendance reports
- **Settings** - Institute profile, user management

## Documentation

| Document | Description |
|----------|-------------|
| [Tech Stack](docs/TECH_STACK.md) | Complete tech stack & project structure |
| [PRD](prd.md) | Product Requirements Document |
| [Database Design](ddd.md) | Database schema & design |
| [ER Diagram](er.md) | Entity relationships |
| [API Routes](docs/API.md) | Server actions & API patterns |
| [Components](docs/COMPONENTS.md) | UI components guide |
| [Agents](docs/AGENTS.md) | AI agent definitions |
| [Skills](docs/SKILLS.md) | Development workflows |
| [Phases](docs/PHASES.md) | Development roadmap |

## Getting Started

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Update DATABASE_URL in .env

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev
```

## Database

```bash
# Create migration
npx prisma migrate dev --name [description]

# Open Prisma Studio
npx prisma studio

# Seed database
npx prisma db seed
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── ui/          # shadcn/ui components
│   └── [module]/    # Module-specific components
├── lib/             # Utilities & configs
├── actions/         # Server Actions
├── types/           # TypeScript types
└── hooks/           # Custom hooks
```

## License

Private - Bhavna Institute
