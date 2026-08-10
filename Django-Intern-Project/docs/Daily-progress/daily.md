# Django Project – Daily Progress Documentation

## Project Module: Moderator Management System

**Developer:** Govinda Rokaya  
**Technology Stack:** Python (Django REST Framework), MySQL, React (Frontend)  
**Current Progress:** Day 06 Completed, Day 07 Pending  

> ⚠️ **Plan Update (Day 04):** Frontend approach changed from Django Templates to **React**. All further modules are built as REST APIs (Django REST Framework) consumed by a React frontend instead of server-rendered HTML templates.

---

## 📊 Progress Summary

| Day    | Date       | Focus Area                              | Status      |
|--------|------------|-------------------------------------------|-------------|
| Day 01 | 2083-04-19 | Project Setup, Git & Roles                | ✅ Completed |
| Day 02 | 2083-04-20 | URLs & Moderator Model                    | ✅ Completed |
| Day 03 | 2083-04-21 | Django Admin & Report Form                | ✅ Completed |
| Day 04 | 2083-04-22 | Replan: React Frontend + Report API       | ✅ Completed |
| Day 05 | 2083-04-23 | ReportDetailAPIView (GET/PATCH/DELETE)    | ✅ Completed |
| Day 06 | 2083-04-24 | Daily Report Creation (List/Create API)   | ✅ Completed |
| Day 07 | 2083-04-25 | Authentication & Moderation Permissions   | 🟡 Pending  |

---

## Day 01 – Project Setup, Git & Role Division
**Date:** 2083-04-19

**Objectives:** Establish project development workflow, configure Git/GitHub, create branches, assign roles.

**Work Completed:**
- Connected project with Git/GitHub.
- Created required development branch.
- Established branch-based workflow.
- Assigned responsibilities and modules to team members.

**Outcome:** Project environment and Git workflow successfully established with clear role division.  
**Status:** ✅ Completed

---

## Day 02 – URLs & Moderator Model
**Date:** 2083-04-20

**Objectives:** Design initial URL structure, create Moderator model, establish database schema.

**Work Completed:**
- Configured application URLs and integrated with main project.
- Prepared URL patterns for Moderator CRUD operations.
- Designed Moderator model with required fields and relationships.
- Prepared model for Django Admin and CRUD integration.

**Outcome:** Routing structure and Moderator database model successfully created.  
**Status:** ✅ Completed

---

## Day 03 – Django Admin & Report Form
**Date:** 2083-04-21

**Objectives:** Enhance Django Admin, connect/manage models via Admin Panel, begin reporting functionality.

**Work Completed:**
- Registered models in Django Admin.
- Fixed model-related issues and improved visibility.
- Verified model connectivity and tested record management.
- Created initial Report Form and connected with model.

**Outcome:** Moderator models are now manageable via Django Admin, and the initial reporting form has been created.  
**Status:** ✅ Completed

---

## Day 04 – Replan: React Frontend + Report API Foundation
**Date:** 2083-04-22

**Objectives:** Change frontend strategy to React, reframe remaining CRUD as REST API endpoints, lay groundwork for Report API.

**Work Completed:**
- Decided to drop template-based CRUD in favor of a React frontend.
- Restructured plan: Model → Serializer → API View → URL → React Component → Database.
- Began implementing Report API using Django REST Framework.

**Outcome:** Project direction updated to a DRF (backend) + React (frontend) architecture.  
**Status:** ✅ Completed

---

## Day 05 – ReportDetailAPIView (GET / PATCH / DELETE)
**Date:** 2083-04-23

**Objectives:** Implement detail-level API operations for the Report resource; verify GET, PATCH, DELETE.

**Work Completed:**
- Created `ReportDetailAPIView`.
- **GET** — detail retrieval works correctly.
- **PATCH** — partial update works (verified during development).
- **DELETE** — deletion works (verified during development).
- URL pattern configured using `<int:pk>` (e.g. `/report/<int:pk>/`).

**Outcome:** Report detail API (retrieve, update, delete) is functional and ready for integration with the React frontend.  
**Status:** ✅ Completed

---

## Day 06 – Daily Report Creation (List/Create API)
**Date:** 2083-04-24

**Objectives:** Build out the Daily Report creation workflow — allow moderators to submit a report per day, and list/browse existing reports via API.

**Work Completed:**
- Implemented `ReportListCreateAPIView` (GET list, POST create) for Daily Reports.
- Added serializer validation to prevent duplicate reports.
- Configured `/report/` (list & create) and `/report/<int:pk>/` (detail) URLs.
- Tested list/create endpoints via Postman.
- Shared API response contract with the React frontend team.

**Outcome:** Moderators can now create and list Daily Reports through a tested REST API, ready for React frontend integration.  
**Status:** ✅ Completed

---

## Day 07 – Authentication & Moderation Permissions
**Date:** 2083-04-25

### 🎯 Objectives
Secure the Report and Moderator APIs with proper authentication and role-based moderation permissions.

### 🛠 Planned Tasks
- **Authentication:**
  - Configure DRF authentication (e.g. Token or Session authentication) for API access.
  - Ensure only authenticated users can access protected endpoints.
- **Permissions:**
  - Apply `IsAuthenticated` across Report and Moderator API views.
  - Implement custom permission class(es) for moderation-specific rules (e.g. only the owning moderator can edit/delete their report; admin/staff can manage all).
  - Restrict Moderator management endpoints to admin/staff roles.
- **Testing:**
  - Test access with authenticated vs unauthenticated requests via Postman.
  - Verify 401/403 responses are returned correctly for unauthorized access.
  - Confirm moderators cannot edit/delete other moderators' reports.
- **Frontend Prep:**
  - Confirm auth flow (login/token handling) contract with the React frontend team.
  - Document required headers (e.g. `Authorization: Token <token>`) for API requests.

### 📌 Expected Outcome
By end of Day 07, all Report and Moderator API endpoints will be secured with authentication and role-appropriate permissions, ready for the React frontend to integrate a login-protected flow.

**Status:** 🟡 Pending