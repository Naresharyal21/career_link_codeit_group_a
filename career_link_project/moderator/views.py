from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import TemplateView, CreateView, UpdateView, DeleteView
from .forms import ReportForm
from .models import Report


class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = "moderator/dashboard.html"


class ModeratorReportListView(LoginRequiredMixin, TemplateView):
    template_name = "moderator/report_list.html"


class ModeratorReportCreateView(LoginRequiredMixin, CreateView):
    model = Report
    form_class = ReportForm
    template_name = "moderator/report_form.html"
    success_url = reverse_lazy("moderator:dashboard")

    def form_valid(self, form):
        form.instance.reported_by = self.request.user
        messages.success(self.request, "Report submitted successfully.")
        return super().form_valid(form)


class ModeratorReportUpdateView(LoginRequiredMixin, UpdateView):
    model = Report
    form_class = ReportForm
    template_name = "moderator/report_form.html"
    success_url = reverse_lazy("moderator:dashboard")


class ModeratorReportDeleteView(LoginRequiredMixin, DeleteView):
    model = Report
    template_name = "moderator/report_confirm_delete.html"
    success_url = reverse_lazy("moderator:dashboard")