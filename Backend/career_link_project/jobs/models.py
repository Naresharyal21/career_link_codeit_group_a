from django.db import models
from accounts.models import TimeStamp, EmployerProfile


class JobCategory(TimeStamp):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = "Job Category"
        verbose_name_plural = "Job Categories"

    def __str__(self):
        return self.name


class Skill(TimeStamp):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class JobPosting(TimeStamp):
    class JobType(models.TextChoices):
        FULL_TIME = "FT", "Full-time"
        PART_TIME = "PT", "Part-time"
        REMOTE = "RM", "Remote"
        CONTRACT = "CT", "Contract"

    class ExperienceLevel(models.TextChoices):
        ENTRY = "EN", "Entry Level"
        MID = "MD", "Mid Level"
        SENIOR = "SR", "Senior Level"

    employer = models.ForeignKey(
        EmployerProfile,
        on_delete=models.CASCADE,
        related_name="job_postings",
    )
    title = models.CharField(max_length=150)
    description = models.TextField()
    responsibilities = models.TextField(blank=True)
    requirements = models.TextField(blank=True)
    benefits = models.TextField(blank=True)

    category = models.ForeignKey(
        JobCategory,
        on_delete=models.SET_NULL,
        null=True,
        related_name="job_postings",
    )
    skills = models.ManyToManyField(Skill, blank=True, related_name="job_postings")

    job_type = models.CharField(
        max_length=2, choices=JobType.choices, default=JobType.FULL_TIME
    )
    experience_level = models.CharField(
        max_length=2, choices=ExperienceLevel.choices, default=ExperienceLevel.ENTRY
    )

    location = models.CharField(max_length=100)
    salary_min = models.PositiveIntegerField(blank=True, null=True)
    salary_max = models.PositiveIntegerField(blank=True, null=True)

    is_urgent = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    deadline = models.DateField(blank=True, null=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Job Posting"
        verbose_name_plural = "Job Postings"

    def __str__(self):
        return self.employer.company_name
