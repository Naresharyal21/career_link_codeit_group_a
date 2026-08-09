from django.contrib import admin
from django.contrib.auth.admin import UserAdmin


from accounts.models import  User , JobseekerProfile , EmployerProfile


# Register your models here.

admin.site.register(User, UserAdmin)
admin.site.register(JobseekerProfile)
admin.site.register(EmployerProfile)
