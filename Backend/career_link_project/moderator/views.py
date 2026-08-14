from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Count, Avg, F, ExpressionWrapper, DurationField
from django.utils import timezone
from datetime import timedelta
from moderator.models import Report
from moderator.permissions import IsModerator, IsJobSeeker
from moderator.serializers import ReportSerializer
from moderator.services import (
    reject_report,
    resolve_report,
    review_report,
)


class ModeratorDashboardAPIView(APIView):
    """Return the aggregate data needed by the moderator dashboard.

    The current schema only models moderation reports. Job approval and
    company-flag workflows are not represented by dedicated fields/models,
    so those dashboard values are returned as null rather than guessing
    from unrelated fields such as JobPosting.is_active or
    EmployerProfile.is_varified.
    """

    permission_classes = [IsAuthenticated, IsModerator]

    SLA_HOURS = 4

    def get(self, request):
        now = timezone.localtime()
        today = now.date()

        reports = Report.objects.select_related(
            "reported_by",
            "reviewed_by",
            "reported_job__employer",
        )

        queue_reports = reports.filter(
            status__in=[
                Report.Status.PENDING,
                Report.Status.UNDER_REVIEW,
            ]
        )

        resolved_today = reports.filter(
            status=Report.Status.RESOLVED,
            reviewed_at__date=today,
        ).count()

        priority_map = {
            Report.Reason.SPAM: "Medium",
            Report.Reason.FAKE_JOB: "High",
            Report.Reason.SCAM: "High",
            Report.Reason.MISLEADING: "Medium",
            Report.Reason.DUPLICATE: "Low",
            Report.Reason.OFFENSIVE: "Low",
            Report.Reason.EXPIRED: "Low",
            Report.Reason.OTHER: "Low",
        }

        def priority_for(reason):
            return priority_map.get(reason, "Low")

        critical_count = sum(
            1 for reason in queue_reports.values_list("report_reason", flat=True)
            if priority_for(reason) == "High"
        )

        flags = list(
            reports.values("report_reason")
            .annotate(count=Count("id"))
            .order_by("-count", "report_reason")
        )

        total_flags = sum(item["count"] for item in flags) or 1
        flag_breakdown = [
            {
                "reason": item["report_reason"],
                "count": item["count"],
                "percentage": round(item["count"] * 100 / total_flags),
            }
            for item in flags
        ]

        closed_by_moderator = reports.filter(
            reviewed_by=request.user,
            status__in=[Report.Status.RESOLVED, Report.Status.REJECTED],
            reported_at__isnull=False,
            reviewed_at__isnull=False,
        )

        durations = closed_by_moderator.annotate(
            resolution_time=ExpressionWrapper(
                F("reviewed_at") - F("reported_at"),
                output_field=DurationField(),
            )
        )

        average_duration = durations.aggregate(
            average=Avg("resolution_time")
        )["average"]

        duration_rows = list(
            durations.values_list("resolution_time", flat=True)
        )
        closed_count = len(duration_rows)
        sla_limit = timedelta(hours=self.SLA_HOURS)
        within_sla = sum(
            1 for duration in duration_rows
            if duration is not None and duration <= sla_limit
        )

        performance = {
            "today_reviews": reports.filter(
                reviewed_by=request.user,
                reviewed_at__date=today,
            ).count(),
            "average_resolution_minutes": (
                round(average_duration.total_seconds() / 60, 1)
                if average_duration
                else None
            ),
            "sla_resolution_rate": (
                round(within_sla * 100 / closed_count, 1)
                if closed_count
                else None
            ),
        }

        queue = []
        for report in queue_reports.order_by("-reported_at")[:10]:
            priority = priority_for(report.report_reason)
            queue.append({
                "id": report.id,
                "item_type": "Job Post",
                "item_id": report.reported_job_id,
                "item_title": report.reported_job.title,
                "submitted_by": report.reported_by.username,
                "date": timezone.localtime(report.reported_at).isoformat(),
                "priority": priority,
                "status": report.status,
                "status_reason": report.report_reason,
            })

        return Response({
            "stats": {
                "review_queue": {
                    "count": queue_reports.count(),
                    "critical_priority": critical_count,
                },
                "reported_content": {
                    "count": reports.count(),
                    "resolved_today": resolved_today,
                },
                "pending_job_approvals": None,
                "flagged_companies": None,
            },
            "queue": queue,
            "content_flags": flag_breakdown,
            "performance": performance,
            "meta": {
                "timezone": str(timezone.get_current_timezone()),
                "sla_hours": self.SLA_HOURS,
                "unsupported_metrics": [
                    "pending_job_approvals",
                    "flagged_companies",
                ],
            },
        })


class ReportListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ReportSerializer

    def get_queryset(self):
        return Report.objects.select_related(
            "reported_by",
            "reviewed_by",
            "reported_job",
        ).order_by("-reported_at")

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsJobSeeker()]

        return [IsModerator()]

    def perform_create(self, serializer):
        serializer.save(
            reported_by=self.request.user
        )

        
class ReportDetailAPIView(generics.RetrieveAPIView):
    serializer_class = ReportSerializer
    permission_classes = [IsModerator]
    lookup_url_kwarg = "id"

    def get_queryset(self):
        return Report.objects.select_related(
            "reported_job",
            "reported_by",
            "reviewed_by",
        )

class ReportReviewView(APIView):
    permission_classes = [IsAuthenticated, IsModerator]
    lookup_url_kwarg = "id"

    def post(self, request, id):
        report = get_object_or_404(Report, id=id)

        if report.status != "Pending":
            return Response(
                {
                    "detail": (
                        "Only pending reports can be moved "
                        "to Under Review."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        report = review_report(
            report=report,
            moderator=request.user,
        )

        return Response(
            ReportSerializer(report).data,
            status=status.HTTP_200_OK,
        )


class ReportResolveView(APIView):
    permission_classes = [IsAuthenticated, IsModerator]
    lookup_url_kwarg = "id"

    def post(self, request, id):
        report = get_object_or_404(Report, id=id)

        if report.status != "Under Review":
            return Response(
                {
                    "detail": (
                        "Only reports under review "
                        "can be resolved."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        report = resolve_report(
            report=report,
            moderator=request.user,
        )

        return Response(
            ReportSerializer(report).data,
            status=status.HTTP_200_OK,
        )


class ReportRejectView(APIView):
    permission_classes = [IsAuthenticated, IsModerator]
    lookup_url_kwarg = "id"

    def post(self, request, id):
        report = get_object_or_404(Report, id=id)

        if report.status != "Under Review":
            return Response(
                {
                    "detail": (
                        "Only reports under review "
                        "can be rejected."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        report = reject_report(
            report=report,
            moderator=request.user,
        )

        return Response(
            ReportSerializer(report).data,
            status=status.HTTP_200_OK,
        )


