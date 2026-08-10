from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from moderator.models import Report
from moderator.permissions import IsModerator
from moderator.serializers import ReportSerializer


class ReportListCreateAPIView(generics.ListCreateAPIView):
    queryset = Report.objects.select_related(
        "reported_by",
        "reviewed_by",
    )
    serializer_class = ReportSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]

        return [IsModerator()]

    def perform_create(self, serializer):
        serializer.save(
            reported_by=self.request.user,
        )


class ReportDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    lookup_field = "id"
    queryset = Report.objects.select_related(
        "reported_by",
        "reviewed_by",
    )
    serializer_class = ReportSerializer
    permission_classes = [IsModerator]