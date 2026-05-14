import pytest
from factory.django import DjangoModelFactory
from factory import fuzzy, SubFactory
from datetime import date
from django.contrib.auth.models import User
from .models import Audit, Finding, AuditLog


class UserFactory(DjangoModelFactory):
    """Factory to create test users."""
    class Meta:
        model = User
    
    username = fuzzy.FuzzyText(length=8)
    email = fuzzy.FuzzyAttribute(lambda: f"{fuzzy.FuzzyText()}@test.com")
    is_staff = False


class AuditFactory(DjangoModelFactory):
    """Factory to create test audits."""
    class Meta:
        model = Audit
    
    title = fuzzy.FuzzyText(length=12)
    date = date.today()
    auditor = "QA_Engineer"
    status = "planned"


class FindingFactory(DjangoModelFactory):
    """Factory to create test findings."""
    class Meta:
        model = Finding
    
    audit = SubFactory(AuditFactory)
    description = fuzzy.FuzzyText(length=50)
    severity = "medium"
    status = "open"


class AuditLogFactory(DjangoModelFactory):
    """Factory to create test audit logs."""
    class Meta:
        model = AuditLog
    
    audit = SubFactory(AuditFactory)
    user = SubFactory(UserFactory)
    action = "create"
    changed_fields = {}

# ============ MODEL TESTS ============

@pytest.mark.django_db
class TestAuditModel:
    """Tests for Audit model."""
    
    def test_audit_creation(self):
        """Test creating an audit."""
        audit = AuditFactory()
        assert audit.id is not None
        assert audit.title != ""
        assert audit.status == "planned"
    
    def test_audit_title_required(self):
        """Test that title is required."""
        audit = Audit(
            date=date.today(),
            auditor="QA",
            status="planned"
            # Missing title
        )
        with pytest.raises(Exception):  # Django validation error
            audit.full_clean()
    
    def test_audit_str_representation(self):
        """Test audit string representation."""
        audit = AuditFactory(title="Test Audit")
        assert str(audit) == "Test Audit"


@pytest.mark.django_db
class TestFindingModel:
    """Tests for Finding model."""
    
    def test_finding_creation(self):
        """Test creating a finding."""
        finding = FindingFactory()
        assert finding.id is not None
        assert finding.audit is not None
    
    def test_finding_cascade_delete(self):
        """Test that deleting audit deletes findings."""
        audit = AuditFactory()
        finding = FindingFactory(audit=audit)
        audit_id = audit.id
        finding_id = finding.id
        
        audit.delete()
        
        assert not Audit.objects.filter(id=audit_id).exists()
        assert not Finding.objects.filter(id=finding_id).exists()


@pytest.mark.django_db
class TestAuditLogModel:
    """Tests for AuditLog model."""
    
    def test_auditlog_creation(self):
        """Test creating an audit log."""
        log = AuditLogFactory()
        assert log.id is not None
        assert log.action == "create"
        assert log.created_at is not None
    
    def test_auditlog_signal_fires_on_audit_create(self):
        """Test that creating an audit creates a log entry."""
        audit = AuditFactory()
        logs = AuditLog.objects.filter(audit=audit)
        
        assert logs.count() == 1
        assert logs.first().action == "create"

# ============ SERIALIZER TESTS ============

from .serializers import AuditSerializer, FindingSerializer

@pytest.mark.django_db
class TestAuditSerializer:
    """Tests for AuditSerializer."""
    
    def test_serialize_audit(self):
        """Test serializing an audit."""
        audit = AuditFactory(title="Test Audit")
        serializer = AuditSerializer(audit)
        
        assert serializer.data['title'] == "Test Audit"
        assert serializer.data['status'] == "planned"
    
    def test_audit_serializer_invalid_title_empty(self):
        """Test that empty title is rejected."""
        data = {
            'title': '',
            'date': date.today(),
            'auditor': 'QA',
            'status': 'planned'
        }
        serializer = AuditSerializer(data=data)
        assert not serializer.is_valid()
        assert 'title' in serializer.errors


@pytest.mark.django_db
class TestFindingSerializer:
    """Tests for FindingSerializer."""
    
    def test_serialize_finding(self):
        """Test serializing a finding."""
        finding = FindingFactory(description="Test finding")
        serializer = FindingSerializer(finding)
        
        assert serializer.data['severity'] == "medium"
        assert serializer.data['status'] == "open"
    
    def test_finding_serializer_invalid_severity(self):
        """Test that invalid severity is rejected."""
        audit = AuditFactory()
        data = {
            'audit': audit.id,
            'description': 'Test' * 5,
            'severity': 'invalid_severity',
            'status': 'open'
        }
        serializer = FindingSerializer(data=data)
        assert not serializer.is_valid()
        assert 'severity' in serializer.errors
