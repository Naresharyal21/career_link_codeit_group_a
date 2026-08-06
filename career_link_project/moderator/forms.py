from django import forms
from .models import Report

class ReportForm(forms.ModelForm):
    class Meta:
        model = Report
        fields = ['report_reason', 'report_description', 'reported_job']
        
        def clean_report_reason(self):
            reason = self.cleaned_data["report_reason"].strip()

            if not reason:
                raise forms.ValidationError("Report reason cannot be empty.")

            return reason

        def clean_report_description(self):
            description = self.cleaned_data["report_description"].strip()

            if len(description) < 20:
                raise forms.ValidationError(
                    "Description must contain at least 20 characters."
                )

            return description