from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Application
from .serializers import ApplicationSerializer

class ApplicationListCreateView(generics.ListCreateAPIView):
    # GET request to get all applications of logged_in user
    # POST request to create new application for logged-in user
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_query(self):
        return Application.objects.filter(
            user=self.request.user
        ).select_related("job").order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ApplicationDetailView(generics.RetrieveUpdateDestroyAPIView):

    # GET: Get one application
    # PUT/PATCH: Update application
    # DELETE: Delete application
    

    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(
            user=self.request.user
        ).select_related("job")