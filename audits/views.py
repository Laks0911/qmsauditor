from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Audit, Finding
from .serializers import AuditSerializer, FindingSerializer

class AuditViewSet(viewsets.ModelViewSet):
    queryset = Audit.objects.all()
    serializer_class = AuditSerializer

class FindingViewSet(viewsets.ModelViewSet):
    queryset = Finding.objects.all()
    serializer_class = FindingSerializer

