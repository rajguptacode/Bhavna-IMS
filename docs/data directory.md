# Bhavna Institute IMS

# Data Dictionary & Field Standards v1.0

## Global Standards

### Primary Key

All tables:

Type:
UUID

Field:

id

Example:

550e8400-e29b-41d4-a716-446655440000

---

## Timestamps

All tables must contain:

createdAt
updatedAt

Type:

DateTime

---

## Soft Delete

Applicable Tables:

* students
* staff
* leads

Field:

status

Records are never physically deleted.

---

# 1. Roles Table

Table Name:

roles

| Field       | Type     | Required | Unique |
| ----------- | -------- | -------- | ------ |
| id          | UUID     | Yes      | Yes    |
| name        | String   | Yes      | Yes    |
| description | String   | No       | No     |
| createdAt   | DateTime | Yes      | No     |
| updatedAt   | DateTime | Yes      | No     |

Allowed Values:

Admin
Reception
Counselor
Teacher
Accountant

---

# 2. Users Table

Table Name:

users

| Field        | Type     | Required | Unique |
| ------------ | -------- | -------- | ------ |
| id           | UUID     | Yes      | Yes    |
| roleId       | UUID     | Yes      | No     |
| fullName     | String   | Yes      | No     |
| email        | String   | Yes      | Yes    |
| mobile       | String   | Yes      | Yes    |
| passwordHash | String   | Yes      | No     |
| isActive     | Boolean  | Yes      | No     |
| lastLogin    | DateTime | No       | No     |
| createdAt    | DateTime | Yes      | No     |
| updatedAt    | DateTime | Yes      | No     |

Validation:

Email format required.

Mobile:

10 digits minimum.

---

# 3. Students Table

Table Name:

students

| Field         | Type     | Required | Unique |
| ------------- | -------- | -------- | ------ |
| id            | UUID     | Yes      | Yes    |
| studentCode   | String   | Yes      | Yes    |
| fullName      | String   | Yes      | No     |
| fatherName    | String   | Yes      | No     |
| motherName    | String   | No       | No     |
| mobile        | String   | Yes      | Yes    |
| email         | String   | No       | No     |
| gender        | Enum     | Yes      | No     |
| dob           | Date     | Yes      | No     |
| address       | String   | Yes      | No     |
| city          | String   | No       | No     |
| state         | String   | No       | No     |
| pincode       | String   | No       | No     |
| admissionDate | Date     | Yes      | No     |
| photoUrl      | String   | No       | No     |
| status        | Enum     | Yes      | No     |
| remarks       | String   | No       | No     |
| createdAt     | DateTime | Yes      | No     |
| updatedAt     | DateTime | Yes      | No     |

---

## Gender Enum

MALE

FEMALE

OTHER

---

## Student Status Enum

ACTIVE

COMPLETED

INACTIVE

DROPPED

ALUMNI

---

# 4. Courses Table

Table Name:

courses

| Field        | Type     | Required | Unique |
| ------------ | -------- | -------- | ------ |
| id           | UUID     | Yes      | Yes    |
| courseCode   | String   | Yes      | Yes    |
| name         | String   | Yes      | No     |
| description  | String   | No       | No     |
| duration     | Integer  | Yes      | No     |
| durationType | Enum     | Yes      | No     |
| fees         | Decimal  | Yes      | No     |
| isActive     | Boolean  | Yes      | No     |
| createdAt    | DateTime | Yes      | No     |
| updatedAt    | DateTime | Yes      | No     |

---

## DurationType Enum

DAYS

WEEKS

MONTHS

---

# 5. Batches Table

Table Name:

batches

| Field     | Type     | Required | Unique |
| --------- | -------- | -------- | ------ |
| id        | UUID     | Yes      | Yes    |
| batchCode | String   | Yes      | Yes    |
| batchName | String   | Yes      | No     |
| courseId  | UUID     | Yes      | No     |
| trainerId | UUID     | No       | No     |
| startDate | Date     | Yes      | No     |
| endDate   | Date     | No       | No     |
| capacity  | Integer  | Yes      | No     |
| classroom | String   | No       | No     |
| status    | Enum     | Yes      | No     |
| createdAt | DateTime | Yes      | No     |
| updatedAt | DateTime | Yes      | No     |

---

## Batch Status Enum

UPCOMING

ACTIVE

COMPLETED

CANCELLED

---

# Validation Rules

Student Code:

Unique

Course Code:

Unique

Batch Code:

Unique

Mobile:

Numeric only

Attendance:

One attendance per student per day

Payment Amount:

Must be greater than zero

Dates:

Must be valid dates

---

# Naming Convention

Database:

camelCase

Examples:

studentCode
courseCode
batchCode
createdAt
updatedAt

---

# Index Standards

Students:

studentCode
mobile
admissionDate

Courses:

courseCode

Batches:

batchCode
courseId

Users:

email
mobile

This document defines the field-level standards for Bhavna Institute IMS and serves as the foundation for Prisma Schema generation.
