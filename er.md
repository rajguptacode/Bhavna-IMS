# Bhavna Institute IMS

# ER Diagram Specification v1.0

## Overview

This document defines all database relationships for Bhavna Institute IMS MVP.

The objective is to establish clear entity relationships before API development and database implementation.

---

# Core Entities

Authentication

* Roles
* Users

Academics

* Students
* Courses
* Batches
* Enrollments

Operations

* Attendance
* Payments
* Fee Structures

CRM

* Leads
* Lead Activities

People

* Staff

---

# Relationship Map

Role
↓
Users

Student
↓
Enrollment
↓
Course

Enrollment
↓
Batch

Student
↓
Attendance

Student
↓
Payments

Course
↓
Fee Structure

Lead
↓
Lead Activities

Staff
↓
Batch

---

# Role → User

Relationship Type:

One To Many

Example:

One Role
→ Many Users

Admin
→ User 1
→ User 2
→ User 3

Database:

roles.id
↓

users.roleId

---

# Student → Enrollment

Relationship Type:

One To Many

Reason:

A student may join multiple courses during their institute journey.

Example:

Student
→ DCA
→ Tally
→ Advanced Excel

Database:

students.id
↓

enrollments.studentId

---

# Course → Enrollment

Relationship Type:

One To Many

Reason:

Many students can enroll in the same course.

Database:

courses.id
↓

enrollments.courseId

---

# Batch → Enrollment

Relationship Type:

One To Many

Reason:

Many students belong to one batch.

Database:

batches.id
↓

enrollments.batchId

---

# Student → Attendance

Relationship Type:

One To Many

Reason:

One student generates attendance records every day.

Database:

students.id
↓

attendance.studentId

---

# Batch → Attendance

Relationship Type:

One To Many

Reason:

Attendance belongs to a batch session.

Database:

batches.id
↓

attendance.batchId

---

# Student → Payments

Relationship Type:

One To Many

Reason:

Students can make multiple payments.

Example:

Installment 1
Installment 2
Installment 3

Database:

students.id
↓

payments.studentId

---

# Enrollment → Payments

Relationship Type:

One To Many

Reason:

Payments should be linked to a specific course enrollment.

Database:

enrollments.id
↓

payments.enrollmentId

---

# Course → Fee Structure

Relationship Type:

One To One

Reason:

Each course has one active fee structure.

Database:

courses.id
↓

feeStructures.courseId

---

# Staff → Batch

Relationship Type:

One To Many

Reason:

One trainer can manage multiple batches.

Database:

staff.id
↓

batches.trainerId

---

# Lead → Lead Activities

Relationship Type:

One To Many

Reason:

Every follow-up must be recorded.

Example:

Call
WhatsApp
Visit
Demo

Database:

leads.id
↓

leadActivities.leadId

---

# Lead Conversion Flow

Lead
↓
Contacted
↓
Interested
↓
Demo Scheduled
↓
Admission Pending
↓
Converted
↓
Student Created

System Action:

Create Student

Create Enrollment

Archive Lead

---

# ER Diagram (Text Format)

roles
│
└── users

students
│
├── enrollments
│   ├── courses
│   └── batches
│
├── attendance
│
└── payments

courses
│
└── feeStructures

staff
│
└── batches

leads
│
└── leadActivities

---

# Cardinality Summary

Role → Users
1:N

Student → Enrollments
1:N

Course → Enrollments
1:N

Batch → Enrollments
1:N

Student → Attendance
1:N

Batch → Attendance
1:N

Student → Payments
1:N

Enrollment → Payments
1:N

Course → Fee Structure
1:1

Staff → Batches
1:N

Lead → Lead Activities
1:N

---

# Database Rules

Students cannot exist without admission records.

Enrollments require:

* Student
* Course
* Batch

Payments require:

* Student
* Enrollment

Attendance requires:

* Student
* Batch

Lead Activities require:

* Lead

---

# MVP Entity Count

Core Tables:

1. roles
2. users
3. students
4. courses
5. batches
6. enrollments
7. staff
8. feeStructures
9. payments
10. attendance
11. leads
12. leadActivities

Total:
12 Core Tables

This ER Specification is the source of truth for Prisma schema generation and API design.
