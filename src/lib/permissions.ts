import { type Role } from "./constants"

// ==========================================
// PERMISSION TYPES
// ==========================================

export type Permission =
  | "CREATE"
  | "READ"
  | "UPDATE"
  | "DELETE"
  | "VIEW"
  | "EXPORT"

export type Module =
  | "dashboard"
  | "students"
  | "courses"
  | "batches"
  | "attendance"
  | "payments"
  | "leads"
  | "staff"
  | "reports"
  | "users"
  | "settings"

// ==========================================
// PERMISSION MATRIX (from security.md)
// ==========================================

export const PERMISSION_MATRIX: Record<Module, Record<Role, Permission[]>> = {
  dashboard: {
    ADMIN: ["READ"],
    RECEPTION: ["READ"],
    COUNSELOR: ["READ"],
    TEACHER: ["READ"],
    ACCOUNTANT: ["READ"],
  },
  students: {
    ADMIN: ["CREATE", "READ", "UPDATE", "DELETE"],
    RECEPTION: ["CREATE", "READ", "UPDATE", "DELETE"],
    COUNSELOR: ["READ"],
    TEACHER: ["READ"],
    ACCOUNTANT: ["READ"],
  },
  courses: {
    ADMIN: ["CREATE", "READ", "UPDATE", "DELETE"],
    RECEPTION: ["READ"],
    COUNSELOR: ["READ"],
    TEACHER: ["READ"],
    ACCOUNTANT: ["READ"],
  },
  batches: {
    ADMIN: ["CREATE", "READ", "UPDATE", "DELETE"],
    RECEPTION: ["READ"],
    COUNSELOR: ["READ"],
    TEACHER: ["READ"],
    ACCOUNTANT: ["READ"],
  },
  attendance: {
    ADMIN: ["CREATE", "READ", "UPDATE", "DELETE"],
    RECEPTION: ["READ"],
    COUNSELOR: ["READ"],
    TEACHER: ["CREATE", "READ", "UPDATE", "DELETE"],
    ACCOUNTANT: ["READ"],
  },
  payments: {
    ADMIN: ["CREATE", "READ", "UPDATE", "DELETE"],
    RECEPTION: ["CREATE", "READ", "UPDATE", "DELETE"],
    COUNSELOR: [],
    TEACHER: ["READ"],
    ACCOUNTANT: ["CREATE", "READ", "UPDATE", "DELETE"],
  },
  leads: {
    ADMIN: ["CREATE", "READ", "UPDATE", "DELETE"],
    RECEPTION: ["CREATE", "READ", "UPDATE", "DELETE"],
    COUNSELOR: ["CREATE", "READ", "UPDATE", "DELETE"],
    TEACHER: [],
    ACCOUNTANT: [],
  },
  staff: {
    ADMIN: ["CREATE", "READ", "UPDATE", "DELETE"],
    RECEPTION: [],
    COUNSELOR: [],
    TEACHER: [],
    ACCOUNTANT: [],
  },
  reports: {
    ADMIN: ["READ", "EXPORT"],
    RECEPTION: ["READ"],
    COUNSELOR: ["READ"],
    TEACHER: ["READ"],
    ACCOUNTANT: ["READ"],
  },
  users: {
    ADMIN: ["CREATE", "READ", "UPDATE", "DELETE"],
    RECEPTION: [],
    COUNSELOR: [],
    TEACHER: [],
    ACCOUNTANT: [],
  },
  settings: {
    ADMIN: ["CREATE", "READ", "UPDATE", "DELETE"],
    RECEPTION: [],
    COUNSELOR: [],
    TEACHER: [],
    ACCOUNTANT: [],
  },
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export function hasPermission(role: Role, module: Module, permission: Permission): boolean {
  const modulePermissions = PERMISSION_MATRIX[module]?.[role]
  if (!modulePermissions) return false
  return modulePermissions.includes(permission)
}

export function hasAnyPermission(role: Role, module: Module): boolean {
  const modulePermissions = PERMISSION_MATRIX[module]?.[role]
  if (!modulePermissions) return false
  return modulePermissions.length > 0
}

export function getModulePermissions(role: Role, module: Module): Permission[] {
  return PERMISSION_MATRIX[module]?.[role] ?? []
}

export function canCreate(role: Role, module: Module): boolean {
  return hasPermission(role, module, "CREATE")
}

export function canRead(role: Role, module: Module): boolean {
  return hasPermission(role, module, "READ")
}

export function canUpdate(role: Role, module: Module): boolean {
  return hasPermission(role, module, "UPDATE")
}

export function canDelete(role: Role, module: Module): boolean {
  return hasPermission(role, module, "DELETE")
}

export function canExport(role: Role, module: Module): boolean {
  return hasPermission(role, module, "EXPORT")
}
