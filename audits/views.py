from rest_framework import viewsets
from .models import Audit, Finding
from .serializers import AuditSerializer, FindingSerializer
from .permissions import IsAdminOrAuditor


class AuditViewSet(viewsets.ModelViewSet):
    queryset = Audit.objects.all().order_by('-created_at')
    serializer_class = AuditSerializer
    permission_classes = [IsAdminOrAuditor]


class FindingViewSet(viewsets.ModelViewSet):
    serializer_class = FindingSerializer
    permission_classes = [IsAdminOrAuditor]

    def get_queryset(self):
        audit_id = self.request.query_params.get('audit_id')
        if audit_id:
            return Finding.objects.filter(
                audit_id=audit_id
            ).order_by('-created_at')
        return Finding.objects.all().order_by('-created_at')
