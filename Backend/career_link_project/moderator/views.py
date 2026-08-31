from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Report, JobApproval
from .serializers import ReportSerializer, JobApprovalSerializer
from .permissions import (
    IsJobSeeker,
    CanCreateReport,
    IsModerator,
    IsAdminOrOwnerReadOnly,
)
from .pagination import ReportPagination
from . import services


def reports_visible_to(user):
    """
    Scope a Report queryset to what `user` is allowed to see:
      - admin (is_staff): every report
      - employer: only reports filed against jobs they posted
      - job seeker: only reports they personally filed
      - anyone else: nothing
    """
    qs = Report.objects.select_related(
        "reported_by",
        "reported_job",
        "reviewed_by",
    )

    if user.is_staff:
        return qs
    if user.role == "ep":
        return qs.filter(reported_job__employer__user=user)
    if user.role == "js":
        return qs.filter(reported_by=user)
    return qs.none()



class ModeratorDashboardView(APIView):
    permission_classes = [IsModerator]

    def get(self, request):
        return Response({
            "total_reports": Report.objects.count(),

            "pending_reports": Report.objects.filter(
                status="Pending"
            ).count(),

            "under_review_reports": Report.objects.filter(
                status="Under Review"
            ).count(),

            "resolved_reports": Report.objects.filter(
                status="Resolved"
            ).count(),

            "rejected_reports": Report.objects.filter(
                status="Rejected"
            ).count(),
        })


class ReportListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ReportSerializer
    pagination_class = ReportPagination

    def get_permissions(self):
        # Any authenticated job seeker or moderator/admin can file a report.
        # Listing is open to any authenticated user; get_queryset()
        # scopes what each role actually sees (admin: all, employer:
        # reports on their own jobs, job seeker: reports they filed).
        if self.request.method == "POST":
            return [CanCreateReport()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = reports_visible_to(self.request.user)

        # Optional ?status=Pending,Under Review (comma-separated) —
        # lets callers like the review queue ask for only the
        # statuses they care about, filtered server-side so it
        # still works correctly across pages. Unrecognized values
        # are dropped; if nothing valid is left, no status filter
        # is applied (matches the old "no filter" behavior).
        requested_statuses = self.request.query_params.get("status")
        if requested_statuses:
            valid_statuses = {
                choice[0] for choice in Report.STATUS_CHOICES
            }
            statuses = [
                value.strip()
                for value in requested_statuses.split(",")
                if value.strip() in valid_statuses
            ]
            if statuses:
                queryset = queryset.filter(status__in=statuses)

        return queryset

    def perform_create(self, serializer):
        serializer.save(
            reported_by=self.request.user
        )


class ReportDetailAPIView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = ReportSerializer
    # Admins get full read/write; employers and job seekers get
    # read-only access, and only within their scoped queryset below.
    permission_classes = [IsAdminOrOwnerReadOnly]

    lookup_url_kwarg = "id"

    def get_queryset(self):
        return reports_visible_to(self.request.user)

    def destroy(self, request, *args, **kwargs):
        report = self.get_object()

        if report.status in ("Resolved", "Rejected"):
            return Response(
                {
                    "detail": (
                        "Resolved or rejected reports cannot be "
                        "deleted, to preserve the moderation "
                        "audit trail."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return super().destroy(request, *args, **kwargs)


class StartReviewAPIView(APIView):
    permission_classes = [IsModerator]

    def post(self, request, id):
        report = get_object_or_404(Report, id=id)

        if report.status != "Pending":
            return Response(
                {
                    "detail": (
                        "Only pending reports can be "
                        "started for review."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        report = services.review_report(report, request.user)

        return Response(
            ReportSerializer(report).data,
            status=status.HTTP_200_OK,
        )


class ResolveReportAPIView(APIView):
    permission_classes = [IsModerator]

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

        report = services.resolve_report(report, request.user)

        return Response(
            ReportSerializer(report).data,
            status=status.HTTP_200_OK,
        )


class RejectReportAPIView(APIView):
    permission_classes = [IsModerator]

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

        report = services.reject_report(report, request.user)

        return Response(
            ReportSerializer(report).data,
            status=status.HTTP_200_OK,
        )
    

class JobApprovalListAPIView(generics.ListAPIView):
    serializer_class = JobApprovalSerializer
    pagination_class = ReportPagination
    permission_classes = [
        IsAuthenticated,
        IsModerator,
    ]

    def get_queryset(self):
        valid_statuses = {
            choice[0] for choice in JobApproval.STATUS_CHOICES
        }

        # Default to "Pending" to preserve existing behavior when no
        # ?status= is given. An unrecognized value falls back to
        # "Pending" too, rather than silently returning everything.
        requested_status = self.request.query_params.get("status")
        status_filter = (
            requested_status
            if requested_status in valid_statuses
            else "Pending"
        )

        return (
            JobApproval.objects
            .select_related(
                "job",
                "job__employer",
                "job__employer__user",
                "reviewed_by",
            )
            .filter(status=status_filter)
        )
    


class JobApprovalApproveAPIView(APIView):
    permission_classes = [
        IsAuthenticated,
        IsModerator,
    ]

    def post(self, request, pk):
        approval = get_object_or_404(
            JobApproval,
            pk=pk,
        )

        approval.status = "Approved"
        approval.reviewed_by = request.user
        approval.reviewed_at = timezone.now()
        approval.rejection_reason = ""
        approval.save()

        return Response(
            JobApprovalSerializer(
                approval
            ).data,
            status=status.HTTP_200_OK,
        )
    

class JobApprovalRejectAPIView(APIView):
    permission_classes = [
        IsAuthenticated,
        IsModerator,
    ]

    def post(self, request, pk):
        approval = get_object_or_404(
            JobApproval,
            pk=pk,
        )

        approval.status = "Rejected"
        approval.reviewed_by = request.user
        approval.reviewed_at = timezone.now()
        approval.rejection_reason = (
            request.data.get(
                "rejection_reason",
                ""
            )
        )

        approval.save()

        return Response(
            JobApprovalSerializer(
                approval
            ).data,
            status=status.HTTP_200_OK,
        )