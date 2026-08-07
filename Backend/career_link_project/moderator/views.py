from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Report
from .serializers import ReportSerializer


class ReportListCreateAPIView(generics.ListCreateAPIView):
    queryset = Report.objects.select_related(
        "reported_by",
        "reported_job",
        "reviewed_by",
    )
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(
            reported_by=self.request.user,
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
    permission_classes = [IsAuthenticated]