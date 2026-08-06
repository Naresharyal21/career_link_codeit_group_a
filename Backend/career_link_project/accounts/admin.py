from django.contrib import admin


from accounts.models import  User , JobSeekerProfile , EmployeerProfile


# Register your models here.

admin.site.register(User)
admin.site.register(JobSeekerProfile)
admin.site.register(EmployeerProfile)
