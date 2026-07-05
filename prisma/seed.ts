import { PrismaClient } from "../src/generated/prisma/client"

const prisma = new PrismaClient({} as never)

async function main() {
  console.log("Seeding database...")

  // Create roles
  const roles = await Promise.all([
    prisma.role.upsert({
      where: { name: "ADMIN" },
      update: {},
      create: {
        name: "ADMIN",
        description: "Full system access",
      },
    }),
    prisma.role.upsert({
      where: { name: "RECEPTION" },
      update: {},
      create: {
        name: "RECEPTION",
        description: "Student registration, admissions, fees, leads",
      },
    }),
    prisma.role.upsert({
      where: { name: "COUNSELOR" },
      update: {},
      create: {
        name: "COUNSELOR",
        description: "Lead management, follow-ups, admissions counseling",
      },
    }),
    prisma.role.upsert({
      where: { name: "TEACHER" },
      update: {},
      create: {
        name: "TEACHER",
        description: "Attendance and student records",
      },
    }),
    prisma.role.upsert({
      where: { name: "ACCOUNTANT" },
      update: {},
      create: {
        name: "ACCOUNTANT",
        description: "Fee collection and financial reports",
      },
    }),
  ])

  console.log("Roles created:", roles.map((r) => r.name).join(", "))

  // Create default admin user
  const adminRole = await prisma.role.findUnique({
    where: { name: "ADMIN" },
  })

  if (adminRole) {
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@bhavnaims.com" },
      update: {},
      create: {
        email: "admin@bhavnaims.com",
        fullName: "Admin User",
        mobile: "9999999999",
        passwordHash: "admin123", // In production, hash this with bcrypt/argon2
        roleId: adminRole.id,
        isActive: true,
      },
    })

    console.log("Admin user created:", adminUser.email)
  }

  console.log("Seeding completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
