# CHANGED: added "import logging" (used by the new logger below)
import logging

from django.contrib.auth import login
from django.db import transaction
from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

# CHANGED: import the two notification helpers from the notifications app
from notifications.utils import (
    notify_job_approval_update,
    notify_matching_job_seekers,
)

from .api_serializers import (
    JobApprovalSerializer,
    ModeratorUserSerializer,
    ReportReadSerializer,
    ReportWriteSerializer,
)
from .models import JobApproval, Report
from .pagination import JobApprovalPagination, ReportPagination
from .permissions import (
    CanCreateReport,
    IsAdminOrOwnerReadOnly,
    IsModerator,
    has_moderator_access,
)
from .serializers import AdminLoginSerializer, AdminRegistrationSerializer
from .services import reject_report, resolve_report, review_report

# CHANGED: module-level logger, used to record notification failures
logger = logging.getLogger(__name__)


class AdminRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AdminRegistrationSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            return Response(
                {
                    "message": "Admin registration sucessfully",
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                    },
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            login(request, user)
            return Response(
                {
                    "message": "Admin login successful",
                    "user": ModeratorUserSerializer(user).data,
                },
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReportListCreateView(generics.ListCreateAPIView):
    queryset = Report.objects.select_related(
        "reported_job__employer",
        "reported_by",
        "reviewed_by",
    )
    pagination_class = ReportPagination

    def get_permissions(self):
        permission_class = (
            CanCreateReport
            if self.request.method == "POST"
            else permissions.IsAuthenticated
        )
        return [permission_class()]

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user

        if has_moderator_access(user):
            return self._filter_status(queryset)
        if user.role == "js":
            queryset = queryset.filter(reported_by=user)
        elif user.role == "ep":
            queryset = queryset.filter(reported_job__employer__user=user)
        else:
            queryset = queryset.none()

        return self._filter_status(queryset)

    def _filter_status(self, queryset):
        requested_statuses = {
            value.strip()
            for value in self.request.query_params.get("status", "").split(",")
            if value.strip()
        }
        valid_statuses = requested_statuses.intersection(
            {value for value, _label in Report.STATUS_CHOICES}
        )
        if valid_statuses:
            queryset = queryset.filter(status__in=valid_statuses)

        return queryset

    def get_serializer_class(self):
        if self.request.method == "POST":
            return ReportWriteSerializer
        return ReportReadSerializer

    def perform_create(self, serializer):
        serializer.save(reported_by=self.request.user)


class ReportDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminOrOwnerReadOnly]
    queryset = Report.objects.select_related(
        "reported_job__employer",
        "reported_by",
        "reviewed_by",
    )

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        if has_moderator_access(user):
            return queryset
        if user.role == "js":
            return queryset.filter(reported_by=user)
        if user.role == "ep":
            return queryset.filter(reported_job__employer__user=user)
        return queryset.none()

    def get_serializer_class(self):
        if self.request.method in permissions.SAFE_METHODS:
            return ReportReadSerializer
        return ReportWriteSerializer


class ModeratorDashboardView(APIView):
    permission_classes = [IsModerator]

    def get(self, request):
        reports = Report.objects.all()
        counts = reports.aggregate(
            total_reports=Count("id"),
            pending_reports=Count("id", filter=Q(status="Pending")),
            under_review_reports=Count(
                "id",
                filter=Q(status="Under Review"),
            ),
            resolved_reports=Count("id", filter=Q(status="Resolved")),
            rejected_reports=Count("id", filter=Q(status="Rejected")),
        )
        counts["recent_reports"] = ReportReadSerializer(
            reports.select_related(
                "reported_job__employer",
                "reported_by",
                "reviewed_by",
            )[:10],
            many=True,
            context={"request": request},
        ).data
        return Response(counts)


class JobApprovalListView(generics.ListAPIView):
    serializer_class = JobApprovalSerializer
    permission_classes = [IsModerator]
    queryset = JobApproval.objects.select_related(
        "job__employer",
        "reviewed_by",
    )
    pagination_class = JobApprovalPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        valid_statuses = {
            value for value, _label in JobApproval.STATUS_CHOICES
        }
        requested_status = self.request.query_params.get(
            "status",
            "Pending",
        )
        if requested_status not in valid_statuses:
            requested_status = "Pending"
        return queryset.filter(status=requested_status)


class ReportActionView(APIView):
    permission_classes = [IsModerator]
    expected_status = None
    action = None

    def post(self, request, pk):
        with transaction.atomic():
            report = get_object_or_404(
                Report.objects.select_for_update(),
                pk=pk,
            )
            if report.status != self.expected_status:
                return Response(
                    {
                        "detail": (
                            f"Cannot {self.action} a report with status "
                            f"'{report.status}'."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            updated_report = self.transition(report, request.user)
            return Response(
                ReportReadSerializer(
                    updated_report,
                    context={"request": request},
                ).data
            )

    def transition(self, report, moderator):
        raise NotImplementedError


class StartReportReviewView(ReportActionView):
    expected_status = "Pending"
    action = "start review"
    transition = staticmethod(review_report)


class ResolveReportView(ReportActionView):
    expected_status = "Under Review"
    action = "resolve"
    transition = staticmethod(resolve_report)


class RejectReportView(ReportActionView):
    expected_status = "Under Review"
    action = "reject"
    transition = staticmethod(reject_report)


class JobApprovalActionView(APIView):
    permission_classes = [IsModerator]
    new_status = None

    # CHANGED: new method. Creates the employer notification and, on the
    # first approval only, the job-match notifications for job seekers.
    # Each call has its own try/except so one failure cannot block the other,
    # and a notification error can never break the moderator's action.
    @staticmethod
    def _notify(approval, old_status):
        try:
            notify_job_approval_update(approval)
        except Exception:
            logger.exception(
                "Approval notification failed for approval %s", approval.pk
            )

        # Job-match alerts only on Pending -> Approved, never on Rejected -> Approved
        if approval.status == "Approved" and old_status == "Pending":
            try:
                notify_matching_job_seekers(approval.job)
            except Exception:
                logger.exception(
                    "Job-match notifications failed for job %s", approval.job_id
                )

    def post(self, request, pk):
        rejection_reason = ""
        if self.new_status == "Rejected":
            rejection_reason = request.data.get("rejection_reason", "")
            if not isinstance(rejection_reason, str):
                return Response(
                    {"rejection_reason": "Enter a text reason."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        with transaction.atomic():
            approval = get_object_or_404(
                JobApproval.objects.select_for_update().select_related(
                    # CHANGED: also load the employer's user (was "job__employer")
                    # because the notification is sent to job.employer.user
                    "job__employer__user"
                ),
                pk=pk,
            )
            # CHANGED: remember the status before overwriting it
            old_status = approval.status
            approval.status = self.new_status
            approval.reviewed_by = request.user
            approval.reviewed_at = timezone.now()
            approval.rejection_reason = rejection_reason
            approval.save(
                update_fields=[
                    "status",
                    "reviewed_by",
                    "reviewed_at",
                    "rejection_reason",
                    "updated_at",
                ]
            )

            # CHANGED: send notifications only after the transaction commits,
            # and only when the status really changed (blocks duplicates when
            # approve or reject is called twice)
            if old_status != self.new_status:
                transaction.on_commit(lambda: self._notify(approval, old_status))

            return Response(
                JobApprovalSerializer(
                    approval,
                    context={"request": request},
                ).data
            )


class ApproveJobView(JobApprovalActionView):
    new_status = "Approved"


class RejectJobView(JobApprovalActionView):
    new_status = "Rejected"