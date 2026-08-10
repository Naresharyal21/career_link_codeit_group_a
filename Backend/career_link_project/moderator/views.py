from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from moderator.models import Report
from moderator.permissions import IsModerator
from moderator.serializers import ReportSerializer
from moderator.services import (
    reject_report,
    resolve_report,
    review_report,
)


class ReportListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ReportSerializer

    def get_queryset(self):
        return Report.objects.select_related(
            "reported_by",
            "reviewed_by",
        ).order_by("-reported_at")

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]

        return [IsModerator()]

    def perform_create(self, serializer):
        serializer.save(
            reported_by=self.request.user
        )


class ReportDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReportSerializer
    permission_classes = [IsModerator]

    def get_queryset(self):
        return Report.objects.select_related(
            "reported_by",
            "reviewed_by",
        )


class ReportReviewView(APIView):
    permission_classes = [IsAuthenticated, IsModerator]

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


