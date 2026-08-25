from django.contrib import admin
from django.contrib.auth.admin import UserAdmin


from accounts.models import  User , JobseekerProfile , EmployerProfile


class CustomUserAdmin(UserAdmin):
    # 1. Show the field in the user detail/edit form
    fieldsets = (
        *UserAdmin.fieldsets,  # Keeps all original Django user fields
        (
            'Additional Info',  # Header title for your new section
            {
                'fields': ('role',),  # Add your new field name here
            },
        ),
    )


# Register your models here.

admin.site.register(User, CustomUserAdmin)
admin.site.register(JobseekerProfile)
admin.site.register(EmployerProfile)
