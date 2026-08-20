# Jobs API

Base: `http://127.0.0.1:8000/api/v1/jobs/`

All endpoints are GET, public (no auth needed).

## GET /api/v1/jobs/

List active job postings. Paginated, page size 3, `?page=2` for next page.

Response:
```json
{
  "count": 5,
  "next": "http://127.0.0.1:8000/api/v1/jobs/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Senior Full Stack Developer",
      "employer_name": "CloudTech Solutions Nepal",
      "location": "Kathmandu, Nepal",
      "salary_min": 120000,
      "salary_max": 180000,
      "job_type": "FT",
      "job_type_display": "Full-time",
      "experience_level": "SR",
      "category_name": "Information Technology",
      "skills": [{ "id": 1, "name": "React" }, { "id": 2, "name": "Django" }],
      "is_urgent": false,
      "is_featured": false,
      "created_at": "2026-08-16T11:20:03+05:45"
    }
  ]
}
```

`job_type` is one of `FT` / `PT` / `RM` / `CT`. `experience_level` is `EN` / `MD` / `SR`.

## GET /api/v1/jobs/<id>/

Single job. Same fields as above plus `description`, `responsibilities`, `requirements`, `benefits`, `is_active`, `deadline`. 404 if not found or inactive.

## GET /api/v1/jobs/categories/

All categories, not paginated. `[{ "id": 1, "name": "Marketing" }, ...]`

## GET /api/v1/jobs/skills/

All skills, not paginated. `[{ "id": 1, "name": "React" }, ...]`

---

Notes:
- `employer_name` and `category_name` are flat strings, not nested — don't do `employer.company_name`, just `employer_name`.
- categories/skills aren't paginated, fetch once and cache on the frontend.
- CORS allowed for `localhost:5173`, `127.0.0.1:5173`, `localhost:5174` — add your port to `CORS_ALLOWED_ORIGINS` in settings.py if needed.
- frontend calls live in `frontend/career_link/src/apis/jobsApi.js`.
