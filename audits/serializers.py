from rest_framework import serializers
from .models import Audit, Finding


class FindingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Finding
        fields = '__all__'


class AuditSerializer(serializers.ModelSerializer):
    findings = FindingSerializer(many=True, read_only=True)

    class Meta:
        model = Audit
        fields = '__all__'
