from django.db import models
from jobs.models import JobPosting
from accounts.models import JobseekerProfile as JobSeekerProfile

class TimeStampedModel(models.Model):
    """
    Abstract base model to track created and updated TimeStamps.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

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
        JobSeekerProfile,
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


    def __str__(self):
        return f"{self.job_seeker} - {self.job.title}"

class SavedJob(models.Model):
    """
    Model to store jobs saved/bookmarked by a job seeker.
    """

    job_seeker = models.ForeignKey(
        JobSeekerProfile,
        on_delete=models.CASCADE,
        related_name="saved_jobs",
    )

    job = models.ForeignKey(
        JobPosting,
        on_delete=models.CASCADE,
        related_name="saved_by",
    )

    saved_at = models.DateTimeField(auto_now_add=True)

    note = models.CharField(
        max_length=255,
        blank=True,
        help_text="Optional note added by the job seeker.",
    )

    class Meta:
        ordering = ["-saved_at"]
        verbose_name = "Saved Job"
        verbose_name_plural = "Saved Jobs"
        constraints = [
            models.UniqueConstraint(
                fields=["job_seeker", "job"],
                name="unique_saved_job_per_job_seeker",
            )
        ]


    def __str__(self):
        return f"{self.job_seeker} saved {self.job.title}"

class ApplicationNote(TimeStampedModel):
    """
    Internal notes added by the employer for an application.
    """
    application = models.ForeignKey(
        Application,
        on_delete=models.CASCADE,
        related_name="notes",
    )
    
    employer = models.ForeignKey(
        "accounts.EmployerProfile",
        on_delete=models.CASCADE,
        related_name="application_notes",
    )
    
    note = models.TextField()

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Application Note"
        verbose_name_plural = "Application Notes"

    def __str__(self):
        return f"Note for {self.application.job.title} - {self.application.job_seeker}"
