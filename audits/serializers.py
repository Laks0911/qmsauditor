from rest_framework import serializers
from .models import Audit, Finding


class FindingSerializer(serializers.ModelSerializer):
    severity = serializers.ChoiceField(
        choices=Finding.SEVERITY_CHOICES,
        help_text="Finding severity level: minor, major, or critical"
    )
    class Meta:
        model = Finding
        fields = ['id', 'audit', 'description', 'severity', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_description(self, value):
        """Ensure description is not empty and reasonable length."""
        if not value or len(value.strip()) < 10:
            raise serializers.ValidationError(
                "Description must be at least 10 characters."
            )
        if len(value) > 5000:
            raise serializers.ValidationError(
                "Description must not exceed 5000 characters."
            )
        return value.strip()

    def validate_severity(self, value):
        """Validate severity is in allowed choices."""
        if value not in [choice[0] for choice in Finding.SEVERITY_CHOICES]:
            raise serializers.ValidationError(
                f"Invalid severity. Allowed: {Finding.SEVERITY_CHOICES}"
            )
        return value


class AuditSerializer(serializers.ModelSerializer):
    findings = FindingSerializer(many=True, read_only=True)

    class Meta:
        model = Audit
        fields = ['id', 'title', 'date', 'auditor', 'status', 'findings', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_title(self, value):
        """Ensure title is not empty."""
        if not value or len(value.strip()) < 3:
            raise serializers.ValidationError(
                "Title must be at least 3 characters."
            )
        return value.strip()

    def validate_status(self, value):
        """Validate status is in choices."""
        valid_statuses = [choice[0] for choice in Audit.STATUS_CHOICES]
        if value not in valid_statuses:
            raise serializers.ValidationError(
                f"Invalid status. Allowed: {Audit.STATUS_CHOICES}"
            )
        return value