from django.shortcuts import render
from django.generic import TemplateView


class DashboardView(TemplateView):
    template_name = "moderator/dashboard.html"