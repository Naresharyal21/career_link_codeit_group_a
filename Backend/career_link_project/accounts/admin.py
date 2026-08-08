from django.contrib import admin


from accounts.models import  User , JobseekerProfile , EmployerProfile


# Register your models here.

admin.site.register(User)
admin.site.register(JobseekerProfile)
admin.site.register(EmployerProfile)
