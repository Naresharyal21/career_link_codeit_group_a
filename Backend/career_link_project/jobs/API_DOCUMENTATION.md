# Jobs API - Documentation

Written by Anita Gurung
Covers the jobs module - JobPosting, JobCategory, Skill models

Base URL: http://127.0.0.1:8000/api/v1/jobs/

## Public endpoints (anyone can access, no login needed)

### GET /api/v1/jobs/
Returns all job postings as a plain array. No pagination on the backend yet -
we handle pagination on the frontend by slicing the array (works fine for now
since we don't have many jobs, might need to revisit if the list grows a lot).

Example response:
```json
[
  {
    "id": 7,
    "title": "Frontend Developer Intern",
    "employer_name": "Horizon Media Group",
    "location": "Kathmandu, Nepal",
    "salary_min": 20000,
    "salary_max": 35000,
    "job_type": "FT",
    "job_type_display": "Full-time",
    "experience_level": "EN",
    "category_name": "Information Technology",
    "skills": [{ "id": 2, "name": "React" }],
    "is_urgent": false,
    "is_featured": false,
    "created_at": "2026-08-25T11:20:03+05:45"
  }
]
```

job_type can be: FT, PT, RM, CT (full-time/part-time/remote/contract)
experience_level can be: EN, MD, SR (entry/mid/senior)

### GET /api/v1/jobs/<id>/
Same as above but for one job, and includes a few extra fields not shown in
the list view: description, responsibilities, requirements, benefits,
is_active, deadline, applicant_count.

Returns 404 if the job doesn't exist.

### GET /api/v1/jobs/categories/
Just returns all categories, not paginated:
```json
[{ "id": 1, "name": "Information Technology" }, { "id": 2, "name": "Marketing" }]
```

### GET /api/v1/jobs/skills/
Same idea, all skills:
```json
[{ "id": 1, "name": "React" }, { "id": 2, "name": "Django" }]
```

## Protected endpoints - employers only

Base: /api/v1/jobs/manage/

You need to be logged in and send the token like this:
Authorization: Bearer <access_token>

Also your account needs role = "ep" and an EmployerProfile linked to it, or
these endpoints won't let you in. The employer field on a job posting gets
set automatically from your logged-in profile - you never send it yourself.

### GET /api/v1/jobs/manage/
Lists only your own postings, not everyone's.

### POST /api/v1/jobs/manage/
Create a new job. Send something like:
```json
{
  "title": "Frontend Developer Intern",
  "description": "Looking for a motivated frontend dev intern...",
  "responsibilities": "Build UI components, fix bugs",
  "requirements": "Basic knowledge of React and JavaScript",
  "benefits": "Flexible hours, mentorship",
  "category": 1,
  "skills": [2],
  "job_type": "FT",
  "experience_level": "EN",
  "location": "Kathmandu, Nepal",
  "salary_min": 20000,
  "salary_max": 35000,
  "is_urgent": false,
  "is_featured": false,
  "is_active": true,
  "deadline": "2026-09-30"
}
```
category and skills are IDs, not names. salary_min/salary_max/category/deadline
can all be null if you don't have them.

Returns 201 with the created job (including its new id) if it works.

### GET /api/v1/jobs/manage/<id>/
Same as the detail view but only works if it's your own posting.

### PUT /api/v1/jobs/manage/<id>/
Update a posting. Same body as POST, just full replace not partial.

### DELETE /api/v1/jobs/manage/<id>/
Deletes it. Returns 204 with no body.

## Errors you might get

400 - something's wrong with what you sent (missing field, bad salary range etc)
401 - you didn't send a token, or it's expired/invalid
403 - you're logged in but not an employer, so you can't use /manage/
404 - job doesn't exist, or it's not yours (for the manage endpoints)

## Depends on

- accounts module for login/auth and EmployerProfile - can't create job
  postings without a proper employer account set up there
- Frontend files: src/apis/jobsApi.js (public stuff), 
  src/apis/employerJobsApi.js (the manage/ stuff)
- Make sure CORS allows your frontend port (5173/5174) in settings.py

## Known gaps / things to bring up

- No real pagination on the backend, only frontend-side right now
- No UI to manage categories/skills, only Django admin for now
- The /employer/post-job route on the frontend isn't locked to employers yet
  - still needs a role check, waiting on how auth/roles get handled overall