# CareerLink — Database Table Relationships

*How the tables link together: relationship types, keys, and Django implementation*

**Core rule:** a foreign key always lives on the "many" side of a relationship, and always points to the primary key of the "one" side. Tables are never linked primary-key-to-primary-key directly — the one exception is a one-to-one relationship, where the foreign key column also carries a `UNIQUE` constraint.

---

## 1. Relationship Type for Every Table Pair

| Relationship | Type | How it's linked |
|---|---|---|
| User → JobSeekerProfile | One-to-One | `JobSeekerProfile.user_id` is a unique FK → `User.id` |
| User → EmployerProfile | One-to-One | `EmployerProfile.user_id` is a unique FK → `User.id` |
| User → Notification | One-to-Many | `Notification.user_id` is a FK → `User.id` |
| User → Report | One-to-Many | `Report.reported_by_id` is a FK → `User.id` |
| EmployerProfile → JobPosting | One-to-Many | `JobPosting.employer_id` is a FK → `EmployerProfile.id` |
| JobCategory → JobPosting | One-to-Many | `JobPosting.category_id` is a FK → `JobCategory.id` |
| JobSeekerProfile → Application | One-to-Many | `Application.job_seeker_id` is a FK → `JobSeekerProfile.id` |
| JobPosting → Application | One-to-Many | `Application.job_posting_id` is a FK → `JobPosting.id` |
| JobSeekerProfile → SavedJob | One-to-Many | `SavedJob.job_seeker_id` is a FK → `JobSeekerProfile.id` |
| JobPosting → SavedJob | One-to-Many | `SavedJob.job_posting_id` is a FK → `JobPosting.id` |
| JobSeekerProfile ↔ Skill | Many-to-Many | Join table with FKs → `JobSeekerProfile.id` and → `Skill.id` |
| JobPosting ↔ Skill | Many-to-Many | Join table with FKs → `JobPosting.id` and → `Skill.id` |

---

## 2. Why Each Type Is What It Is

### One-to-One (User ↔ Profile)

A person is either a job seeker or an employer — never zero, never two of the same profile. The foreign key column also has a `UNIQUE` constraint, which is what turns an ordinary foreign key into a one-to-one instead of a one-to-many.

### One-to-Many (most of the schema)

The "many" side always holds the foreign key. For example, `JobPosting` holds `employer_id`, not the other way around — because one employer posts many jobs, but each job belongs to exactly one employer.

### Many-to-Many (Skill)

A skill such as "Python" applies to many job seekers and many job postings at once, and a job seeker or posting can have many skills. A single foreign key column cannot express that, so a separate join table sits in the middle holding two foreign keys — one to each side.

---

## 3. How Django Implements This

Django gives you three field types that map directly onto the relationship types above, so you never hand-build a join table yourself:

```python
class JobPosting(models.Model):
    employer = models.ForeignKey(EmployerProfile,
        on_delete=models.CASCADE)              # many-to-one
    category = models.ForeignKey(JobCategory,
        on_delete=models.SET_NULL, null=True)  # many-to-one
    required_skills = models.ManyToManyField(Skill)  # Django auto-creates
                                                       # the join table

class JobSeekerProfile(models.Model):
    user = models.OneToOneField(User,
        on_delete=models.CASCADE)  # FK + unique constraint
```

- **`ForeignKey`** → one-to-many; the FK column is added automatically on this model.
- **`OneToOneField`** → same as `ForeignKey` but with a hidden `unique=True`.
- **`ManyToManyField`** → Django silently creates and manages the join table; you just call `job.required_skills.add(python_skill)`.

---

## 4. One More Thing to Decide: `on_delete` Behavior

Every `ForeignKey` and `OneToOneField` needs an `on_delete` rule, which decides what happens to child rows when the parent row is deleted:

- **`CASCADE`** — delete the child too. E.g. delete an employer's job postings if the employer account itself is deleted.
- **`SET_NULL`** — keep the record but blank the link (requires `null=True`). E.g. keep a job posting if its category is deleted, just with no category.
- **`PROTECT`** — block the deletion entirely if related rows still exist. Useful for records you never want silently lost, like a `JobPosting` with active `Application`s.
