from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    class Role(models.TextChoices):
        JOB_SEEKER = "JOB_SEEKER", "Job Seeker"
        EMPLOYER = "EMPLOYER", "Employer"

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.JOB_SEEKER,
    )


class TimeStampedModel(models.Model):
    """
    Abstract base model to track created and updated timestamps.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Employer(TimeStampedModel):
    """
    Employer profile linked to a Django user.
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="employer_profile",
    )

    company_name = models.CharField(max_length=255)
    company_email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    website = models.URLField(blank=True)
    address = models.TextField(blank=True)
    about = models.TextField(blank=True)

    logo = models.ImageField(
        upload_to="employer_logos/",
        blank=True,
        null=True,
    )

    is_verified = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=["company_name"]),
        ]
        verbose_name = "Employer"
        verbose_name_plural = "Employers"

    def __str__(self):
        return self.company_name


class JobSeeker(TimeStampedModel):
    """
    Job seeker profile linked to a Django user.
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="job_seeker_profile",
    )

    headline = models.CharField(
        max_length=255,
        blank=True,
        help_text="Example: Backend Developer | Django | Python",
    )

    phone = models.CharField(max_length=30, blank=True)
    location = models.CharField(max_length=255, blank=True)
    about = models.TextField(blank=True)

    resume = models.FileField(
        upload_to="resumes/%Y/%m/",
        blank=True,
        null=True,
    )

    portfolio = models.URLField(blank=True)

    skills = models.JSONField(
        default=list,
        blank=True,
        help_text='Example: ["Python", "Django", "PostgreSQL"]',
    )

    open_to_work = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Job Seeker"
        verbose_name_plural = "Job Seekers"

    def __str__(self):
        return str(self.user)


class JobPostingQuerySet(models.QuerySet):
    def published(self):
        """
        Returns published jobs whose deadline has not passed.
        """
        return self.filter(
            is_published=True,
        ).filter(
            models.Q(deadline__isnull=True) | models.Q(deadline__gt=timezone.now())
        )


class JobPosting(TimeStampedModel):
    """
    Job posted by an employer.
    """

    class EmploymentType(models.TextChoices):
        FULL_TIME = "FULL_TIME", "Full-time"
        PART_TIME = "PART_TIME", "Part-time"
        CONTRACT = "CONTRACT", "Contract"
        INTERNSHIP = "INTERNSHIP", "Internship"
        FREELANCE = "FREELANCE", "Freelance"

    class ExperienceLevel(models.TextChoices):
        ENTRY = "ENTRY", "Entry Level"
        MID = "MID", "Mid Level"
        SENIOR = "SENIOR", "Senior"
        LEAD = "LEAD", "Lead / Manager"

    employer = models.ForeignKey(
        Employer,
        on_delete=models.CASCADE,
        related_name="job_postings",
    )

    title = models.CharField(max_length=255)

    description = models.TextField()

    requirements = models.TextField(
        blank=True,
        help_text="Optional requirements or qualifications.",
    )

    location = models.CharField(
        max_length=255,
        blank=True,
    )

    is_remote = models.BooleanField(default=False)

    employment_type = models.CharField(
        max_length=20,
        choices=EmploymentType.choices,
        default=EmploymentType.FULL_TIME,
    )

    experience_level = models.CharField(
        max_length=20,
        choices=ExperienceLevel.choices,
        default=ExperienceLevel.ENTRY,
    )

    min_salary = models.PositiveIntegerField(
        blank=True,
        null=True,
        validators=[MinValueValidator(0)],
    )

    max_salary = models.PositiveIntegerField(
        blank=True,
        null=True,
        validators=[MinValueValidator(0)],
    )

    currency = models.CharField(
        max_length=3,
        default="USD",
        help_text="Example: USD, EUR, INR",
    )

    skills = models.JSONField(
        default=list,
        blank=True,
        help_text='Example: ["Python", "Django", "REST API"]',
    )

    is_published = models.BooleanField(default=False)

    deadline = models.DateTimeField(
        blank=True,
        null=True,
        help_text="Optional application deadline.",
    )

    objects = JobPostingQuerySet.as_manager()

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Job Posting"
        verbose_name_plural = "Job Postings"

        indexes = [
            models.Index(fields=["employer", "is_published"]),
            models.Index(fields=["employment_type"]),
            models.Index(fields=["experience_level"]),
            models.Index(fields=["created_at"]),
        ]

        constraints = [
            models.CheckConstraint(
                condition=(
                    models.Q(min_salary__isnull=True)
                    | models.Q(max_salary__isnull=True)
                    | models.Q(min_salary__lte=models.F("max_salary"))
                ),
                name="job_posting_min_salary_lte_max_salary",
            ),
        ]

    def __str__(self):
        return self.title

    def clean(self):
        """
        Model-level validation.
        """

        if (
            self.min_salary is not None
            and self.max_salary is not None
            and self.min_salary > self.max_salary
        ):
            raise ValidationError(
                {
                    "max_salary": "Maximum salary must be greater than or equal to minimum salary."
                }
            )

    @property
    def is_active(self):
        """
        A job is active if it is published and its deadline has not passed.
        """

        if not self.is_published:
            return False

        if self.deadline and self.deadline < timezone.now():
            return False

        return True


class Application(TimeStampedModel):
    """
    Application submitted by a job seeker for a job posting.
    """

    class Status(models.TextChoices):
        APPLIED = "APPLIED", "Applied"
        UNDER_REVIEW = "UNDER_REVIEW", "Under Review"
        SHORTLISTED = "SHORTLISTED", "Shortlisted"
        INTERVIEW = "INTERVIEW", "Interview"
        ACCEPTED = "ACCEPTED", "Accepted"
        REJECTED = "REJECTED", "Rejected"
        WITHDRAWN = "WITHDRAWN", "Withdrawn"

    job = models.ForeignKey(
        JobPosting,
        on_delete=models.CASCADE,
        related_name="applications",
    )

    job_seeker = models.ForeignKey(
        JobSeeker,
        on_delete=models.CASCADE,
        related_name="applications",
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.APPLIED,
    )

    cover_letter = models.TextField(blank=True)

    resume = models.FileField(
        upload_to="application_resumes/%Y/%m/",
        blank=True,
        null=True,
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Application"
        verbose_name_plural = "Applications"

        indexes = [
            models.Index(fields=["job", "status"]),
            models.Index(fields=["job_seeker"]),
        ]

        constraints = [
            models.UniqueConstraint(
                fields=["job", "job_seeker"],
                name="unique_application_per_job_and_job_seeker",
            ),
        ]

    def __str__(self):
        return f"{self.job_seeker} - {self.job.title}"