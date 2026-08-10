# Django Project – Daily Progress Documentation

## Project Module: Moderator Management System

**Developer:** Govinda Rokaya  
**Technology Stack:** Python (Django REST Framework), MySQL, React (Frontend)  
**Current Progress:** Week 1 Completed  

> ⚠️ **Plan Update (Day 04):** Frontend approach changed from Django Templates to **React**. All further modules will be built as REST APIs (Django REST Framework) consumed by a React frontend instead of server-rendered HTML templates.

---

## 📊 Progress Summary

| Day    | Date       | Focus Area                              | Status      |
|--------|------------|------------------------------------------|-------------|
| Day 01 | 2083-04-24 |  Report List/Create API + CRUD Finish    | 🟡 Planned |
| Day 02 | 2083-04-25 |                    | ✅ Completed |
| Day 03 | 2083-04-26 |                | ✅ Completed |
| Day 04 | 2083-04-27 |       | ✅ Completed |
| Day 05 | 2083-04-28 |    | ✅ Completed |
| Day 06 | 2083-04-29 |     | 🟡 Planned  |



## Day 01 – Planned Work: Report List/Create API & CRUD Completion
**Date:** 2083-04-24

### 🎯 Objectives
Complete the Report API CRUD cycle and prepare it for React frontend consumption.

### 🛠 Planned Tasks
- **Views:**
  - Implement `ReportListCreateAPIView` (GET list, POST create).
  - Review/finalize `ReportDetailAPIView` (GET, PATCH, PUT, DELETE).
- **Serializers:**
  - Add validation rules to `ReportSerializer`.
  - Handle nested/related fields (e.g. linked Moderator) if applicable.
- **URLs:**
  - `/report/` → list & create
  - `/report/<int:pk>/` → retrieve, update, delete
- **Permissions & Auth:**
  - Add permission classes (e.g. `IsAuthenticated`) to API views.
  - Test access control for moderator-only actions.
- **Testing:**
  - Test all endpoints via Postman/DRF browsable API.
  - Validate error handling (404, 400, 403 responses).
  - Confirm serializer validation messages.
- **Frontend Prep:**
  - Confirm API response shape/contract for React integration.
  - Share sample JSON payloads with frontend team.

### 📌 Expected Outcome
By end of Day 01, the Report module will have a complete, tested REST API (list, create, retrieve, update, delete) with proper permissions — ready for the React frontend to consume.

**Status:** 🟡 Planned