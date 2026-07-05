# Bhavna Institute IMS

# Development Execution Plan (DEP) v1.0

## Purpose

This document defines the exact development sequence for Bhavna Institute IMS.

Objectives:

* Reduce development confusion
* Enable AI-assisted coding
* Ensure scalable architecture
* Minimize rework
* Deliver MVP quickly

---

# Development Philosophy

Rule 1:

Build foundation first.

Rule 2:

Database before UI.

Rule 3:

Authentication before modules.

Rule 4:

Shared components before screens.

Rule 5:

Student Management is the primary focus.

Rule 6:

Leads support admissions but are secondary.

---

# MVP Scope

Modules Included:

Authentication

Dashboard

Students

Courses

Batches

Enrollments

Attendance

Fees

Leads CRM

Staff

Reports

Settings

---

# Project Phases

Phase 0

Project Foundation

Phase 1

Authentication & Security

Phase 2

Core Academic System

Phase 3

Student Operations

Phase 4

Finance

Phase 5

CRM

Phase 6

Reports

Phase 7

Optimization

---

# PHASE 0

# Project Foundation

Goal:

Create project skeleton.

Tasks:

Initialize Next.js

Configure TypeScript

Configure Tailwind

Install shadcn/ui

Install Prisma

Setup PostgreSQL

Configure ESLint

Configure Prettier

Setup Environment Variables

Setup Folder Structure

Create Navigation Config

Create Permission Config

Create Constants

Deliverables:

Working application shell

Database connection successful

Base architecture ready

Completion Criteria:

Application starts successfully.

Database connected successfully.

---

# PHASE 1

# Authentication & Security

Goal:

Secure access to system.

Tasks:

Create Roles

Create Users

Implement Login

Implement Logout

Implement Session Handling

Implement Route Protection

Implement Permission Middleware

Create Audit Log Base

Deliverables:

Users can log in.

Users see only permitted pages.

Completion Criteria:

RBAC working correctly.

---

# PHASE 2

# Core Academic Foundation

Goal:

Create academic master data.

Modules:

Courses

Batches

Staff

Tasks:

Create Course CRUD

Create Batch CRUD

Create Staff CRUD

Create Trainer Assignment

Create Batch Capacity Validation

Deliverables:

Courses operational.

Batches operational.

Staff operational.

Completion Criteria:

Academic foundation completed.

---

# PHASE 3

# Student Management

Goal:

Build primary business module.

Priority:

Highest

Tasks:

Create Student CRUD

Student Profile

Student Status Management

Student Search

Student Filters

Student Timeline

Student Documents

Enrollment Module

Batch Assignment

Course Assignment

Deliverables:

Student lifecycle fully operational.

Completion Criteria:

Institute can manage all students digitally.

---

# PHASE 4

# Attendance System

Goal:

Track daily attendance.

Tasks:

Attendance Entry

Attendance Validation

Attendance Reports

Monthly Reports

Defaulter Reports

Attendance Dashboard

Deliverables:

Attendance fully digitized.

Completion Criteria:

Teachers can manage attendance daily.

---

# PHASE 5

# Fee Management

Goal:

Digitize revenue tracking.

Tasks:

Fee Structures

Payment Collection

Installments

Receipts

Pending Fee Tracking

Fee Dashboard

Revenue Analytics

Deliverables:

Fee system operational.

Completion Criteria:

All student payments tracked digitally.

---

# PHASE 6

# Lead CRM

Goal:

Improve admissions process.

Tasks:

Lead CRUD

Lead Activities

Follow Ups

Lead Pipeline

Lead Assignment

Lead Conversion

Deliverables:

Admission CRM operational.

Completion Criteria:

Lead → Student workflow operational.

---

# PHASE 7

# Dashboard & Reports

Goal:

Business visibility.

Tasks:

Dashboard Metrics

Revenue Reports

Attendance Reports

Student Reports

Admission Reports

Lead Reports

Charts

Analytics

Deliverables:

Management reporting available.

Completion Criteria:

Institute can monitor operations from dashboard.

---

# Database Migration Plan

Migration 1

roles

users

auditLogs

---

Migration 2

courses

staff

batches

---

Migration 3

students

enrollments

---

Migration 4

attendance

---

Migration 5

feeStructures

payments

---

Migration 6

leads

leadActivities

---

# Frontend Build Order

Step 1

Auth Layout

Step 2

Dashboard Layout

Step 3

Shared Components

Step 4

Course Module

Step 5

Batch Module

Step 6

Staff Module

Step 7

Student Module

Step 8

Attendance Module

Step 9

Fee Module

Step 10

Lead Module

Step 11

Reports

---

# Shared Components Build Order

Button

Input

Select

Modal

Drawer

Card

Table

Pagination

Date Picker

File Upload

Page Header

Breadcrumb

Stats Card

Chart Components

---

# API Development Order

Authentication APIs

Course APIs

Batch APIs

Staff APIs

Student APIs

Enrollment APIs

Attendance APIs

Fee APIs

Lead APIs

Report APIs

---

# Testing Plan

Phase Completion Testing

After every phase:

CRUD Testing

Permission Testing

Validation Testing

UI Testing

Database Testing

Audit Testing

---

# Release Strategy

Internal Alpha

↓

Institute Staff Testing

↓

Bug Fixing

↓

Beta Release

↓

Production Release

---

# AI Agent Instructions

Always follow:

PRD

DDD

ER Diagram

API Specification

RBAC Rules

Security Rules

UI Specification

Never create database fields outside approved documents.

Never create APIs outside approved specifications.

Never bypass permission checks.

Never hardcode role permissions.

---

# Definition of MVP Completion

Authentication working.

Students working.

Courses working.

Batches working.

Attendance working.

Fees working.

Leads working.

Reports working.

RBAC working.

Audit logging working.

Dashboard operational.

At this point Bhavna Institute IMS MVP is considered production-ready for internal institute use.

---

# Estimated Documentation Completion

Completed:

PRD

DDD

ER Diagram

API Specification

RBAC & Security

Data Dictionary

Frontend Architecture

UI Specification

Development Execution Plan

Next Documents:

Prisma Schema Specification

Backend Architecture Document

Deployment Architecture

Testing & QA Specification

SaaS Expansion Roadmap

These documents will complete the Bhavna IMS Technical Blueprint.
