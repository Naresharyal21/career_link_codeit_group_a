from rest_framework.views import APIView
from rest_framework.response import Response

class ApplicationListView(APIView):
    def get(self, request):
        return Response({
            "message": "Application list API is working"
        })