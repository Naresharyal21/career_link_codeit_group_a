from django.contrib import admin


from accounts.models import  User , JobseekerProfile , EmployeerProfile


# Register your models here.

admin.site.register(User)
admin.site.register(JobseekerProfile)
admin.site.register(EmployeerProfile)
