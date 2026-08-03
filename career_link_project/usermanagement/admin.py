from django.contrib import admin
from .models import User, Employer, JobPosting, JobSeeker, Application

# Register your models here.
admin.site.register(User)
admin.site.register(Employer)
admin.site.register(JobSeeker)
admin.site.register(JobPosting)
admin.site.register(Application)

