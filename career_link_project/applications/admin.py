from django.contrib import admin
from .models import Application, SavedJob

# Register your models here.
admin.site.register(Application)
admin.site.register(SavedJob)
