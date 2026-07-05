# Bhavna Institute IMS

# Roles & Permissions (RBAC) + Security Design Document v1.0

## 1. Security Objectives

The system must ensure:

* Secure Authentication
* Role Based Access Control (RBAC)
* Data Integrity
* Auditability
* Session Security
* Protection against unauthorized access

---

# 2. User Roles

## Admin

Highest level access.

Responsibilities:

* System Management
* User Management
* Reports
* Configuration
* Data Control

Permissions:

* Full Access

---

## Reception

Responsibilities:

* Student Registration
* Admissions
* Fee Collection
* Student Updates

Permissions:

* Students
* Fees
* Admissions

Restrictions:

* Cannot access system settings
* Cannot manage users

---

## Counselor

Responsibilities:

* Lead Management
* Follow Ups
* Admissions Counseling

Permissions:

* Leads
* Lead Activities
* Lead Conversion

Restrictions:

* Cannot manage fees
* Cannot manage settings

---

## Teacher

Responsibilities:

* Attendance
* Student Progress

Permissions:

* View Students
* Manage Attendance

Restrictions:

* Cannot edit fees
* Cannot manage leads

---

## Accountant

Responsibilities:

* Fee Collection
* Financial Reports

Permissions:

* Payments
* Fee Reports

Restrictions:

* Cannot modify students
* Cannot access leads

---

# 3. Permission Matrix

| Module     | Admin | Reception | Counselor | Teacher   | Accountant |
| ---------- | ----- | --------- | --------- | --------- | ---------- |
| Dashboard  | Full  | Limited   | Limited   | Limited   | Limited    |
| Students   | CRUD  | CRUD      | View      | View      | View       |
| Courses    | CRUD  | View      | View      | View      | View       |
| Batches    | CRUD  | View      | View      | View      | View       |
| Attendance | CRUD  | View      | View      | CRUD      | View       |
| Payments   | CRUD  | CRUD      | No Access | View      | CRUD       |
| Leads      | CRUD  | CRUD      | CRUD      | No Access | No Access  |
| Reports    | CRUD  | Limited   | Limited   | Limited   | Limited    |
| Staff      | CRUD  | No Access | No Access | No Access | No Access  |
| Users      | CRUD  | No Access | No Access | No Access | No Access  |
| Settings   | CRUD  | No Access | No Access | No Access | No Access  |

CRUD =
Create + Read + Update + Delete

---

# 4. Authentication Design

Authentication Method:

Email + Password

Future:

* OTP Login
* Google Login

---

## Password Policy

Minimum:

* 8 characters

Recommended:

* Uppercase
* Lowercase
* Number
* Special Character

---

# 5. Session Management

Session Duration:

8 Hours

Remember Me:

30 Days

Logout:

Manual logout supported.

---

# 6. Route Protection

Public Routes:

* Login
* Forgot Password

Protected Routes:

* Dashboard
* Students
* Attendance
* Fees
* Reports

Unauthorized Users:

Return:

403 Forbidden

---

# 7. API Authorization

Every API request must validate:

1. Authentication
2. User Role
3. Permission

Flow:

User
↓
Auth Check
↓
Role Check
↓
Permission Check
↓
Execute API

---

# 8. Audit Logging

Critical Actions Must Be Logged

Examples:

* Student Created
* Student Updated
* Payment Recorded
* Lead Converted
* User Deleted

Store:

* User
* Action
* Timestamp
* Resource

---

# 9. Security Headers

Recommended:

* Content-Security-Policy
* X-Frame-Options
* X-Content-Type-Options
* Referrer-Policy

---

# 10. Input Validation

Validate:

* Email
* Mobile Number
* Dates
* Amounts

Reject:

* Invalid Data
* Malformed Requests

---

# 11. Database Security

Never expose:

* Password Hashes
* Internal IDs
* Secrets

Sensitive data should only be returned when required.

---

# 12. Password Storage

Never store plain text passwords.

Use:

Password
↓
Hash
↓
Database

Recommended:

Argon2

Alternative:

bcrypt

---

# 13. Soft Delete Policy

Do not permanently delete:

* Students
* Payments
* Attendance
* Leads

Instead:

status = Inactive

Benefits:

* Data Recovery
* Audit Compliance

---

# 14. Data Backup Policy

Daily Backup

Retention:

* 7 Daily Backups
* 4 Weekly Backups

Restore Testing:

Monthly

---

# 15. Security Events

Track:

* Failed Logins
* Password Changes
* User Creation
* User Deletion
* Permission Changes

---

# 16. Future Security Features

Version 2:

* Two Factor Authentication (2FA)
* OTP Login
* Device Tracking
* Login Alerts

Version 3:

* Biometric Authentication
* IP Restrictions
* Advanced Audit Dashboard

---

# 17. Security Rules Summary

1. All APIs require authentication.
2. All actions require role validation.
3. Passwords are hashed.
4. Soft delete for critical data.
5. Audit logs for important actions.
6. Daily backups.
7. Session expiration enforced.
8. Input validation on every request.

This document serves as the security foundation for Bhavna Institute IMS Version 1.0.
