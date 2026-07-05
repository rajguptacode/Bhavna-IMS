# Bhavna Institute IMS

# Data Dictionary & Field Standards v1.1 (Part 2)

## 6. Enrollments Table

Table Name:

enrollments

Purpose:

Student ko Course aur Batch se connect karna.

| Field          | Type     | Required | Unique |
| -------------- | -------- | -------- | ------ |
| id             | UUID     | Yes      | Yes    |
| studentId      | UUID     | Yes      | No     |
| courseId       | UUID     | Yes      | No     |
| batchId        | UUID     | Yes      | No     |
| enrollmentDate | Date     | Yes      | No     |
| completionDate | Date     | No       | No     |
| status         | Enum     | Yes      | No     |
| createdAt      | DateTime | Yes      | No     |
| updatedAt      | DateTime | Yes      | No     |

---

## Enrollment Status Enum

ACTIVE

COMPLETED

DROPPED

TRANSFERRED

---

## Constraints

Student must exist.

Course must exist.

Batch must exist.

Batch course and enrollment course must match.

---

# 7. Staff Table

Table Name:

staff

Purpose:

Institute employees information.

| Field        | Type     | Required | Unique |
| ------------ | -------- | -------- | ------ |
| id           | UUID     | Yes      | Yes    |
| employeeCode | String   | Yes      | Yes    |
| fullName     | String   | Yes      | No     |
| designation  | Enum     | Yes      | No     |
| mobile       | String   | Yes      | Yes    |
| email        | String   | No       | Yes    |
| joiningDate  | Date     | Yes      | No     |
| salary       | Decimal  | No       | No     |
| status       | Enum     | Yes      | No     |
| createdAt    | DateTime | Yes      | No     |
| updatedAt    | DateTime | Yes      | No     |

---

## Designation Enum

ADMIN

TEACHER

COUNSELOR

RECEPTION

ACCOUNTANT

---

## Staff Status Enum

ACTIVE

INACTIVE

RESIGNED

TERMINATED

---

# 8. Fee Structures Table

Table Name:

feeStructures

Purpose:

Course fee configuration.

| Field              | Type     | Required | Unique |
| ------------------ | -------- | -------- | ------ |
| id                 | UUID     | Yes      | Yes    |
| courseId           | UUID     | Yes      | Yes    |
| registrationFee    | Decimal  | Yes      | No     |
| courseFee          | Decimal  | Yes      | No     |
| installmentAllowed | Boolean  | Yes      | No     |
| installmentCount   | Integer  | No       | No     |
| createdAt          | DateTime | Yes      | No     |
| updatedAt          | DateTime | Yes      | No     |

---

## Rules

One active fee structure per course.

Fees cannot be negative.

---

# 9. Payments Table

Table Name:

payments

Purpose:

Student fee collection records.

| Field                | Type     | Required | Unique |
| -------------------- | -------- | -------- | ------ |
| id                   | UUID     | Yes      | Yes    |
| studentId            | UUID     | Yes      | No     |
| enrollmentId         | UUID     | Yes      | No     |
| amount               | Decimal  | Yes      | No     |
| paymentDate          | DateTime | Yes      | No     |
| paymentMode          | Enum     | Yes      | No     |
| transactionReference | String   | No       | No     |
| remarks              | String   | No       | No     |
| collectedBy          | UUID     | Yes      | No     |
| createdAt            | DateTime | Yes      | No     |
| updatedAt            | DateTime | Yes      | No     |

---

## Payment Mode Enum

CASH

UPI

BANK_TRANSFER

CARD

CHEQUE

---

## Validation

Amount > 0

Student must exist.

Enrollment must exist.

---

# 10. Attendance Table

Table Name:

attendance

Purpose:

Daily student attendance.

| Field          | Type     | Required | Unique |
| -------------- | -------- | -------- | ------ |
| id             | UUID     | Yes      | Yes    |
| studentId      | UUID     | Yes      | No     |
| batchId        | UUID     | Yes      | No     |
| attendanceDate | Date     | Yes      | No     |
| status         | Enum     | Yes      | No     |
| remarks        | String   | No       | No     |
| createdAt      | DateTime | Yes      | No     |
| updatedAt      | DateTime | Yes      | No     |

---

## Attendance Status Enum

PRESENT

ABSENT

LATE

LEAVE

---

## Unique Constraint

(studentId, attendanceDate)

Purpose:

Prevent duplicate attendance.

---

# 11. Leads Table

Table Name:

leads

Purpose:

Admission inquiries.

| Field      | Type     | Required | Unique |
| ---------- | -------- | -------- | ------ |
| id         | UUID     | Yes      | Yes    |
| leadCode   | String   | Yes      | Yes    |
| fullName   | String   | Yes      | No     |
| mobile     | String   | Yes      | No     |
| email      | String   | No       | No     |
| source     | Enum     | Yes      | No     |
| status     | Enum     | Yes      | No     |
| assignedTo | UUID     | No       | No     |
| remarks    | String   | No       | No     |
| createdAt  | DateTime | Yes      | No     |
| updatedAt  | DateTime | Yes      | No     |

---

## Lead Source Enum

WEBSITE

WALK_IN

WHATSAPP

FACEBOOK

INSTAGRAM

REFERRAL

CALL

OTHER

---

## Lead Status Enum

NEW

CONTACTED

INTERESTED

DEMO_SCHEDULED

ADMISSION_PENDING

CONVERTED

LOST

---

# 12. Lead Activities Table

Table Name:

leadActivities

Purpose:

Follow-up history.

| Field        | Type     | Required | Unique |
| ------------ | -------- | -------- | ------ |
| id           | UUID     | Yes      | Yes    |
| leadId       | UUID     | Yes      | No     |
| activityType | Enum     | Yes      | No     |
| notes        | Text     | Yes      | No     |
| nextFollowUp | DateTime | No       | No     |
| createdBy    | UUID     | Yes      | No     |
| createdAt    | DateTime | Yes      | No     |

---

## Activity Type Enum

CALL

WHATSAPP

EMAIL

VISIT

DEMO

MEETING

OTHER

---

# 13. Audit Logs Table

Table Name:

auditLogs

Purpose:

Track important system actions.

| Field     | Type     | Required | Unique |
| --------- | -------- | -------- | ------ |
| id        | UUID     | Yes      | Yes    |
| userId    | UUID     | Yes      | No     |
| action    | String   | Yes      | No     |
| module    | String   | Yes      | No     |
| recordId  | UUID     | No       | No     |
| oldValue  | JSON     | No       | No     |
| newValue  | JSON     | No       | No     |
| ipAddress | String   | No       | No     |
| createdAt | DateTime | Yes      | No     |

---

## Example Actions

CREATE_STUDENT

UPDATE_STUDENT

DELETE_STUDENT

CREATE_PAYMENT

CONVERT_LEAD

CREATE_BATCH

UPDATE_COURSE

---

# 14. Dashboard Derived Metrics

No separate tables needed.

Calculated from existing tables.

Metrics:

Total Students

Active Students

Total Leads

Converted Leads

Pending Fees

Revenue

Attendance Percentage

New Admissions

---

# 15. MVP Final Table Count

roles

users

students

courses

batches

enrollments

staff

feeStructures

payments

attendance

leads

leadActivities

auditLogs

Total Core Tables:

13

These definitions are the official field standards and database blueprint for Bhavna Institute IMS MVP.
