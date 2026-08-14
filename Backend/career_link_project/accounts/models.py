from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator


# Create your models here.
class TimeStamp(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class User(AbstractUser):
    class ROLE_CHOOSE(models.TextChoices):
        JOBSEEKERS = "js", "Job Seekers"
        EMPLOYERS = "ep", "Employers"

    role = models.CharField(
        max_length=2,
        choices=ROLE_CHOOSE.choices,
        default=ROLE_CHOOSE.JOBSEEKERS,
    )

    def __str__(self):
        return self.username


        
class JobSeekerProfile(TimeStamp):
  user=models.OneToOneField(User, on_delete=models.CASCADE,related_name="seeker_profile")
  full_name=models.CharField(max_length=50)
  phone=models.CharField(max_length=100, blank=True)
  resume_file=models.FileField(
    upload_to="documents/",
    blank=True,
    null=True,
    validators=[FileExtensionValidator(allowed_extensions=["pdf","doc","docx"])]
    )
  locations=models.CharField(max_length=50)
  profile_pictur=models.ImageField(upload_to="profile_pic/",blank=True,null=True)
  date_of_birth=models.DateTimeField(blank=True, null=True)



  class Meta:
    verbose_name="job Seeker Profile"

  def __str__(self):
     return self.full_name

  


class EmployerProfile(TimeStamp):
  user=models.OneToOneField(User, on_delete=models.CASCADE, related_name="employer_profile")
  company_name=models.CharField(max_length=100)
  company_description=models.CharField(max_length=100, blank=True)
  website=models.URLField(blank=True)
  phone=models.CharField(max_length=100, blank=True)
  logo=models.ImageField(upload_to="company_logo/",blank=True, null=True)
  is_varified=models.BooleanField(default=False)

  class Meta:
    verbose_name="Employer Profile"

  def __str__(self):
    return self.company_name
