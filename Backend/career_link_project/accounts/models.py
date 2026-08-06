from django.db import models


from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator


# Create your models here.
class Timestamp(models.Model):
  created_at=models.DateTimeField(auto_now_add=True)
  updated_at=models.DateTimeField(auto_now=True)

  class Meta:
    abstract=True

class User (AbstractUser,Timestamp):
  class ROLE_CHOOSE(models.TextChoices):
    JOBSEEKERS='js','jobseekers'
    EMPLOYERS='ep','employeer'

  username=models.CharField(max_length=80)

  role=models.CharField(choices=ROLE_CHOOSE, max_length=2,default=ROLE_CHOOSE.JOBSEEKERS)

  def __str__(self):
    return self.username


class JobseekerProfile(Timestamp):
  user=models.OneToOneField(User, on_delete=models.CASCADE,related_name="seeker_profile")
  full_name=models.CharField(max_length=50)
  phone=models.CharField(max_length=100, blank=True)
  resume_file=models.FileField(
    upload_to="documents/",
    blank=True,
    null=True,
    validators=[FileExtensionValidator(allowed_extensions=["pdf","doc","docx"])]
    )
  location=models.CharField(max_length=50)
  profile_picture=models.ImageField(upload_to="profile_pic/",blank=True,null=True)
  date_of_birth=models.DateField(blank=True, null=True)



  class Meta:
    verbose_name="job Seeker Profile"

  def __str__(self):
     return self.full_name

  


class EmployerProfile(Timestamp):
  user=models.OneToOneField(User, on_delete=models.CASCADE, related_name="employer_profile")
  company_name=models.CharField(max_length=100)
  company_description=models.TextField(max_length=300, blank=True)
  website=models.URLField(blank=True)
  phone=models.CharField(max_length=100, blank=True)
  logo=models.ImageField(upload_to="company_logo/",blank=True, null=True)
  is_verified=models.BooleanField(default=False)

  class Meta:
    verbose_name="Employer Profile"

  def __str__(self):
    return self.company_name
