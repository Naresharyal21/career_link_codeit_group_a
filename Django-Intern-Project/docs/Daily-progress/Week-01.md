# Django Project – Daily Progress Documentation

## Project Module: Moderator Management System

**Developer:** Govinda Rokaya  
**Technology Stack:** Python (Django REST Framework), MySQL, React (Frontend)  
**Current Progress:** Day 5 Completed  

> ⚠️ **Plan Update (Day 04):** Frontend approach changed from Django Templates to **React**. All further modules will be built as REST APIs (Django REST Framework) consumed by a React frontend instead of server-rendered HTML templates.

---

## 📊 Progress Summary

| Day    | Date       | Focus Area                              | Status      |
|--------|------------|------------------------------------------|-------------|
| Day 01 | 2083-04-19 | Project Setup, Git & Roles               | ✅ Completed |
| Day 02 | 2083-04-20 | URLs & Moderator Model                   | ✅ Completed |
| Day 03 | 2083-04-20 | Django Admin & Report Form               | ✅ Completed |
| Day 04 | 2083-04-22 | Replan: React Frontend + Report API      | ✅ Completed |
| Day 05 | 2083-04-23 | ReportDetailAPIView (GET/PATCH/DELETE)   | ✅ Completed |
| Week 2 | 2083-04-24 | Report List/Create API + CRUD Finish     | 🟡 Planned  |

---

## Day 01 – Project Setup, Git & Role Division
**Date:** 2083-04-19

### 🎯 Objectives
- Establish project development workflow.
- Configure Git and GitHub integration.
- Create development branches.
- Assign responsibilities among team members.

### ✅ Work Completed
- Connected project with Git/GitHub.
- Created required development branch.
- Established branch-based workflow.
- Assigned responsibilities and modules to team members.

### 📌 Outcome
Project environment and Git workflow successfully established with clear role division.

**Status:** ✅ Completed

---

## Day 02 – URLs & Moderator Model
**Date:** 2083-04-20

### 🎯 Objectives
- Design initial URL structure.
- Create Moderator model.
- Establish database schema for Moderator module.

### ✅ Work Completed
- Configured application URLs and integrated with main project.
- Prepared URL patterns for Moderator CRUD operations.
- Designed Moderator model with required fields and relationships.
- Prepared model for Django Admin and CRUD integration.

### 📌 Outcome
Routing structure and Moderator database model successfully created.

**Status:** ✅ Completed

---

## Day 03 – Django Admin & Report Form
**Date:** 2083-04-21

### 🎯 Objectives
- Enhance Django Admin interface.
- Connect and manage models via Admin Panel.
- Begin reporting functionality development.

### ✅ Work Completed
- Registered models in Django Admin.
- Fixed model-related issues and improved visibility.
- Verified model connectivity and tested record management.
- Created initial Report Form and connected with model.

### 📌 Outcome
Moderator models are now manageable via Django Admin, and the initial reporting form has been created.

**Status:** ✅ Completed

---

## Day 04 – Replan: React Frontend + Report API Foundation
**Date:** 2083-04-22

### 🎯 Objectives
- Change frontend strategy from Django templates to React.
- Reframe remaining CRUD work as REST API endpoints (DRF) instead of template views.
- Lay groundwork for Report API.

### ✅ Work Completed
- Decided to drop template-based CRUD (`moderator_list.html`, `moderator_form.html`, etc.) in favor of a React frontend.
- Restructured plan: Model → Serializer → API View → URL → React Component → Database.
- Began implementing Report API using Django REST Framework.

### 📌 Outcome
Project direction updated to a Django REST Framework (backend) + React (frontend) architecture. Template-based CRUD plan replaced with API-driven CRUD.

**Status:** ✅ Completed

---

## Day 05 – ReportDetailAPIView (GET / PATCH / DELETE)
**Date:** 2083-04-23

### 🎯 Objectives
- Implement detail-level API operations for the Report resource.
- Verify GET, PATCH, and DELETE functionality.

### ✅ Work Completed
- Created `ReportDetailAPIView`.
- **GET** — detail retrieval works correctly.
- **PATCH** — partial update works (verified during development).
- **DELETE** — deletion works (verified during development).
- URL pattern configured using `<int:pk>` (e.g. `/report/<int:pk>/`).

### 📌 Outcome
Report detail API (retrieve, update, delete) is functional and ready for integration with the React frontend.

**Status:** ✅ Completed

---

