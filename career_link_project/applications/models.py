# from django.db import models
# from accounts.models import JobSeekerProfile
# from jobs.models import JobPosting
# # Create your models here.

# class TimeStampedModel(models.Model):
#     """
#     Abstract base model to track created and updated timestamps.
#     """
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         abstract = True

# class Application(TimeStampedModel):
#     """
#     Application submitted by a job seeker for a job posting.
#     """

#     class Status(models.TextChoices):
#         APPLIED = "APPLIED", "Applied"
#         UNDER_REVIEW = "UNDER_REVIEW", "Under Review"
#         SHORTLISTED = "SHORTLISTED", "Shortlisted"
#         INTERVIEW = "INTERVIEW", "Interview"
#         ACCEPTED = "ACCEPTED", "Accepted"
#         REJECTED = "REJECTED", "Rejected"
#         WITHDRAWN = "WITHDRAWN", "Withdrawn"

#     job = models.ForeignKey(
#         JobPosting,
#         on_delete=models.CASCADE,
#         related_name="applications",
#     )

#     job_seeker = models.ForeignKey(
#         JobSeekerProfile,
#         on_delete=models.CASCADE,
#         related_name="applications",
#     )

#     status = models.CharField(
#         max_length=20,
#         choices=Status.choices,
#         default=Status.APPLIED,
#     )

#     cover_letter = models.TextField(blank=True)

#     resume = models.FileField(
#         upload_to="application_resumes/%Y/%m/",
#         blank=True,
#         null=True,
#     )

#     class Meta:
#         ordering = ["-created_at"]
#         verbose_name = "Application"
#         verbose_name_plural = "Applications"


#     def __str__(self):
#         return f"{self.job_seeker} - {self.job.title}"
from django.db import models

# Create your models here.
from accounts.models import JobSeekerProfile
from jobs.models import JobPosting
# Create your models here.

class TimeStampedModel(models.Model):
    """
    Abstract base model to track created and updated timestamps.
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

