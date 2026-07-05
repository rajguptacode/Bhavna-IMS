# Bhavna Institute IMS

# Database Design Document (DDD) v1.0

## 1. Database Overview

### Database Engine

PostgreSQL

### ORM

Prisma ORM

### Primary Key Strategy

All major tables will use UUID as primary keys.

### Naming Convention

Tables:

* users
* roles
* students
* courses
* batches

Columns:

* camelCase naming

Example:

* studentId
* admissionDate
* createdAt

### Common Fields

Every major table must contain:

* id
* createdAt
* updatedAt

Optional future fields:

* createdBy
* updatedBy
* deletedAt

---

# 2. User & Authentication Module

## roles

Purpose:
Stores system roles.

Fields:

* id (UUID)
* name
* description
* createdAt
* updatedAt

Example Roles:

* Admin
* Reception
* Counselor
* Teacher
* Accountant

---

## users

Purpose:
Login accounts.

Fields:

* id (UUID)
* roleId
* fullName
* email
* mobile
* passwordHash
* isActive
* lastLogin
* createdAt
* updatedAt

Relationship:

User → Role

Many users can belong to one role.

---

# 3. Student Module

## students

Purpose:
Stores student master records.

Fields:

* id
* studentCode
* fullName
* fatherName
* motherName
* mobile
* email
* gender
* dob
* address
* city
* state
* pincode
* admissionDate
* photoUrl
* status
* remarks
* createdAt
* updatedAt

Student Status:

* Active
* Completed
* Inactive
* Dropped
* Alumni

Indexes:

* studentCode
* mobile
* admissionDate

Unique:

* studentCode

---

# 4. Course Module

## courses

Purpose:
Stores institute courses.

Fields:

* id
* courseCode
* name
* description
* duration
* durationType
* fees
* isActive
* createdAt
* updatedAt

Duration Types:

* Days
* Weeks
* Months

Unique:

* courseCode

---

# 5. Batch Module

## batches

Purpose:
Stores batch information.

Fields:

* id
* batchCode
* batchName
* courseId
* trainerId
* startDate
* endDate
* capacity
* classroom
* status
* createdAt
* updatedAt

Batch Status:

* Upcoming
* Active
* Completed
* Cancelled

Relationships:

Batch → Course
Batch → Trainer

---

# 6. Enrollment Module

## enrollments

Purpose:
Connects students to courses and batches.

Fields:

* id
* studentId
* courseId
* batchId
* enrollmentDate
* completionDate
* status
* createdAt
* updatedAt

Enrollment Status:

* Active
* Completed
* Dropped

Relationships:

Enrollment → Student
Enrollment → Course
Enrollment → Batch

Why Needed?

A student may enroll in multiple courses over time.

---

# 7. Staff Module

## staff

Purpose:
Stores institute staff.

Fields:

* id
* employeeCode
* fullName
* designation
* mobile
* email
* joiningDate
* salary
* status
* createdAt
* updatedAt

Designations:

* Teacher
* Counselor
* Reception
* Accountant
* Admin

Status:

* Active
* Inactive

---

# 8. Fee Management

## feeStructures

Purpose:
Stores fee plans.

Fields:

* id
* courseId
* totalFee
* registrationFee
* installmentAllowed
* createdAt
* updatedAt

Relationship:

Fee Structure → Course

---

## payments

Purpose:
Stores fee payments.

Fields:

* id
* studentId
* enrollmentId
* amount
* paymentDate
* paymentMode
* transactionReference
* remarks
* createdAt
* updatedAt

Payment Modes:

* Cash
* UPI
* Bank Transfer
* Card

Indexes:

* studentId
* paymentDate

---

# 9. Attendance Module

## attendance

Purpose:
Daily attendance records.

Fields:

* id
* studentId
* batchId
* attendanceDate
* status
* remarks
* createdAt
* updatedAt

Attendance Status:

* Present
* Absent
* Leave
* Late

Unique Constraint:

(studentId, attendanceDate)

Purpose:
Prevent duplicate attendance.

---

# 10. Lead CRM

## leads

Purpose:
Stores inquiries and prospects.

Fields:

* id
* leadCode
* fullName
* mobile
* email
* source
* status
* assignedTo
* remarks
* createdAt
* updatedAt

Lead Sources:

* Website
* Walk-In
* WhatsApp
* Facebook
* Instagram
* Referral
* Call

Lead Status:

* New
* Contacted
* Interested
* Demo Scheduled
* Admission Pending
* Converted
* Lost

---

## leadActivities

Purpose:
Stores lead follow-up history.

Fields:

* id
* leadId
* activityType
* notes
* nextFollowUp
* createdBy
* createdAt

Activity Types:

* Call
* WhatsApp
* Visit
* Demo
* Email

Relationship:

Lead → Lead Activities

One Lead → Many Activities

---

# 11. Dashboard Metrics

Derived from database.

Metrics:

* Total Students
* Active Students
* New Admissions
* Total Leads
* Converted Leads
* Pending Fees
* Revenue
* Attendance Percentage

No separate table required.

---

# 12. Data Integrity Rules

Students cannot be deleted if:

* Payments exist
* Attendance exists
* Enrollments exist

Use:

Soft Delete Strategy

Instead of deleting:

status = Inactive

---

# 13. Future Tables (Version 2)

Planned:

* documents
* certificates
* notifications
* announcements
* auditLogs
* tasks
* reminders
* whatsappMessages

These will be introduced after MVP completion.

---

# 14. MVP Database Scope

Included:

* roles
* users
* students
* courses
* batches
* enrollments
* staff
* feeStructures
* payments
* attendance
* leads
* leadActivities

Total Core Tables:
12

This database design serves as the foundation for Bhavna Institute IMS Version 1.0 and is optimized for future expansion while keeping the MVP manageable and maintainable.
