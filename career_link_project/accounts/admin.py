from django.contrib import admin


from accounts.models import  User , JobSeekerProfile , EmployerProfile


# Register your models here.

admin.site.register(User)
admin.site.register(JobSeekerProfile)
admin.site.register(EmployerProfile)
