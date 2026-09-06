from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Report, JobApproval
from .serializers import ReportSerializer, JobApprovalSerializer
from .permissions import IsJobSeeker, IsModerator



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
    queryset = Report.objects.select_related(
        "reported_by",
        "reported_job",
        "reviewed_by",
    )

    serializer_class = ReportSerializer

    def get_permissions(self):
        # Any authenticated job seeker can file a report.
        # Only moderators can list/browse all reports.
        if self.request.method == "POST":
            return [IsJobSeeker()]
        return [IsModerator()]

    def perform_create(self, serializer):
        serializer.save(
            reported_by=self.request.user
        )


class ReportDetailAPIView(
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = Report.objects.select_related(
        "reported_by",
        "reported_job",
        "reviewed_by",
    )

    serializer_class = ReportSerializer
    permission_classes = [IsModerator]

    lookup_url_kwarg = "id"

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
        try:
            report = Report.objects.get(id=id)
        except Report.DoesNotExist:
            return Response(
                {
                    "detail": "Report not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

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

        report.status = "Under Review"
        report.reviewed_by = request.user
        report.reviewed_at = timezone.now()
        report.save(
            update_fields=[
                "status",
                "reviewed_by",
                "reviewed_at",
                "updated_at",
            ]
        )

        return Response(
            ReportSerializer(report).data,
            status=status.HTTP_200_OK,
        )


class ResolveReportAPIView(APIView):
    permission_classes = [IsModerator]

    def post(self, request, id):
        try:
            report = Report.objects.get(id=id)
        except Report.DoesNotExist:
            return Response(
                {
                    "detail": "Report not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

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

        report.status = "Resolved"
        report.reviewed_by = request.user
        report.reviewed_at = timezone.now()

        report.save(
            update_fields=[
                "status",
                "reviewed_by",
                "reviewed_at",
                "updated_at",
            ]
        )

        return Response(
            ReportSerializer(report).data,
            status=status.HTTP_200_OK,
        )


class RejectReportAPIView(APIView):
    permission_classes = [IsModerator]

    def post(self, request, id):
        try:
            report = Report.objects.get(id=id)
        except Report.DoesNotExist:
            return Response(
                {
                    "detail": "Report not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

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

        report.status = "Rejected"
        report.reviewed_by = request.user
        report.reviewed_at = timezone.now()

        report.save(
            update_fields=[
                "status",
                "reviewed_by",
                "reviewed_at",
                "updated_at",
            ]
        )

        return Response(
            ReportSerializer(report).data,
            status=status.HTTP_200_OK,
        )
    

class JobApprovalListAPIView(APIView):
    permission_classes = [
        IsAuthenticated,
        IsModerator,
    ]

    def get(self, request):
        approvals = (
            JobApproval.objects
            .select_related(
                "job",
                "job__employer",
                "job__employer__user",
                "reviewed_by",
            )
            .filter(status="Pending")
        )

        serializer = JobApprovalSerializer(
            approvals,
            many=True,
        )

        return Response(serializer.data)
    


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