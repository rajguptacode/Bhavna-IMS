# Bhavna Institute IMS

# API Specification v1.0 (MVP)

## Overview

Base URL:

/api/v1

Authentication:

JWT Session Authentication

Content Type:

application/json

---

# Authentication APIs

## Login

POST /auth/login

Purpose:
Authenticate user.

Request:

{
"email": "[admin@bhavnaims.com](mailto:admin@bhavnaims.com)",
"password": "password"
}

Response:

{
"success": true,
"token": "jwt-token",
"user": {}
}

Permissions:
Public

---

## Logout

POST /auth/logout

Purpose:
End current session.

Permissions:
Authenticated Users

---

## Current User

GET /auth/me

Purpose:
Get logged in user.

Permissions:
Authenticated Users

---

# Student Module

## Get Students

GET /students

Purpose:
Fetch all students.

Permissions:

* Admin
* Reception
* Teacher

Filters:

?page=
?limit=
?search=
?status=

Response:

{
"data": [],
"total": 0
}

---

## Get Student By ID

GET /students/:id

Purpose:
Fetch student details.

Permissions:

* Admin
* Reception
* Teacher

---

## Create Student

POST /students

Purpose:
Create student record.

Permissions:

* Admin
* Reception

Request:

{
"fullName": "",
"mobile": "",
"courseId": "",
"batchId": ""
}

---

## Update Student

PATCH /students/:id

Purpose:
Update student.

Permissions:

* Admin
* Reception

---

## Delete Student

DELETE /students/:id

Purpose:
Soft delete student.

Permissions:

* Admin

---

# Course Module

## Get Courses

GET /courses

Permissions:

* All Authenticated Users

---

## Create Course

POST /courses

Permissions:

* Admin

---

## Update Course

PATCH /courses/:id

Permissions:

* Admin

---

## Delete Course

DELETE /courses/:id

Permissions:

* Admin

---

# Batch Module

## Get Batches

GET /batches

Permissions:

* All Authenticated Users

---

## Create Batch

POST /batches

Permissions:

* Admin

---

## Update Batch

PATCH /batches/:id

Permissions:

* Admin

---

## Assign Student To Batch

POST /batches/:id/students

Permissions:

* Admin
* Reception

Request:

{
"studentId": ""
}

---

# Enrollment Module

## Create Enrollment

POST /enrollments

Purpose:
Enroll student into course.

Permissions:

* Admin
* Reception

---

## Get Enrollment

GET /enrollments/:id

Permissions:

* Admin
* Reception

---

# Attendance Module

## Mark Attendance

POST /attendance

Permissions:

* Teacher
* Admin

Request:

{
"studentId": "",
"batchId": "",
"status": "Present"
}

---

## Get Attendance

GET /attendance

Filters:

?date=
?batch=
?student=

Permissions:

* Teacher
* Admin
* Reception

---

## Monthly Attendance Report

GET /attendance/report

Permissions:

* Teacher
* Admin

---

# Fee Module

## Fee Dashboard

GET /fees

Permissions:

* Admin
* Accountant
* Reception

---

## Record Payment

POST /payments

Permissions:

* Admin
* Accountant
* Reception

Request:

{
"studentId": "",
"amount": 5000,
"paymentMode": "UPI"
}

---

## Student Payment History

GET /payments/student/:studentId

Permissions:

* Admin
* Accountant
* Reception

---

## Pending Fees

GET /fees/pending

Permissions:

* Admin
* Accountant

---

# Lead CRM

## Get Leads

GET /leads

Permissions:

* Admin
* Counselor
* Reception

Filters:

?status=
?source=

---

## Create Lead

POST /leads

Permissions:

* Admin
* Counselor
* Reception

---

## Update Lead

PATCH /leads/:id

Permissions:

* Admin
* Counselor

---

## Add Lead Activity

POST /leads/:id/activity

Permissions:

* Admin
* Counselor

Request:

{
"activityType": "Call",
"notes": "Interested in DCA"
}

---

## Convert Lead To Student

POST /leads/:id/convert

Permissions:

* Admin
* Counselor

System Actions:

1. Create Student
2. Create Enrollment
3. Update Lead Status = Converted

---

# Staff Module

## Get Staff

GET /staff

Permissions:

* Admin

---

## Create Staff

POST /staff

Permissions:

* Admin

---

## Update Staff

PATCH /staff/:id

Permissions:

* Admin

---

# Reports Module

## Student Report

GET /reports/students

Permissions:

* Admin

---

## Fee Report

GET /reports/fees

Permissions:

* Admin
* Accountant

---

## Attendance Report

GET /reports/attendance

Permissions:

* Admin
* Teacher

---

## Admission Report

GET /reports/admissions

Permissions:

* Admin

---

# Dashboard APIs

## Dashboard Overview

GET /dashboard

Permissions:

Authenticated Users

Response:

{
"totalStudents": 0,
"activeStudents": 0,
"todayAdmissions": 0,
"pendingFees": 0,
"newLeads": 0,
"todayRevenue": 0
}

---

# Validation Rules

Student Mobile:
Must be unique.

Course Code:
Must be unique.

Batch Code:
Must be unique.

Attendance:
One attendance record per student per day.

Payments:
Amount must be greater than zero.

---

# Error Format

{
"success": false,
"message": "Validation failed",
"errors": []
}

---

# MVP Endpoint Count

Authentication:
3

Students:
5

Courses:
4

Batches:
4

Enrollments:
2

Attendance:
3

Fees:
4

Leads:
5

Staff:
3

Reports:
4

Dashboard:
1

Total:
38 MVP APIs

This API Specification serves as the contract between frontend and backend development teams.
