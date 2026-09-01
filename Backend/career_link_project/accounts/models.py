from django.db import models
from django.conf import settings


from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator


# Create your models here.
class Timestamp(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class User(AbstractUser, Timestamp):
    class Role(models.TextChoices):
        JOBSEEKERS = "js", "jobseekers"
        EMPLOYEERS = "ep", "employeer"

    username = models.CharField(max_length=150, unique=False)

    email = models.EmailField(unique=True)
    email_verified = models.BooleanField(default=False)

    role = models.CharField(choices=Role, max_length=2, default=Role.JOBSEEKERS)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return f"{self.email} - {self.get_role_display()}"
  


class JobseekerProfile(Timestamp):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="seeker_profile",
    )

    phone = models.CharField(max_length=100, blank=True)
    resume_file = models.FileField(
        upload_to="documents/",
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=["pdf", "doc", "docx"])],
    )
    location = models.CharField(max_length=50)
    profile_pictur = models.ImageField(upload_to="profile_pic/", blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)

    class Meta:
        verbose_name = "job Seeker Profile"

    def __str__(self):
        return self.user.username


class EmployerProfile(Timestamp):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="employer_profile",
    )
   
    company_description = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=50)
    website = models.URLField(blank=True)
    phone = models.CharField(max_length=100, blank=True)
    logo = models.ImageField(upload_to="company_logo/", blank=True, null=True)
    is_verified = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Employer Profile"

    def __str__(self):
        return self.user.username


    

class EmailOTP(Timestamp):

        PURPOSE_CHOICES=[
                ("emv","Email Verification"),
                ("prv","Password Verification"),
                ("cev", "Change Email Verification"),
                ("dav","delete Verification"),
            ]
        user = models.ForeignKey(
            settings.AUTH_USER_MODEL,
            on_delete=models.CASCADE,
            related_name="email_otps",
        )
        otp=models.CharField(max_length=6)
        expires_at=models.DateTimeField()
        is_verified=models.BooleanField(default=False)
        purpose = models.CharField(max_length=3,choices=PURPOSE_CHOICES)

        def __str__(self):
            return f"{self.user.email}-{self.purpose}"
