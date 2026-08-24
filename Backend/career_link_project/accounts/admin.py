from django.contrib import admin


from accounts.models import  User , JobseekerProfile , EmployerProfile ,EmailOTP


# Register your models here.

admin.site.register(User)
admin.site.register(JobseekerProfile)
admin.site.register(EmployerProfile)
admin.site.register(EmailOTP)
