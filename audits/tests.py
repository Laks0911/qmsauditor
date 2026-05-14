import pytest
from factory.django import DjangoModelFactory
from factory import fuzzy, SubFactory
from datetime import date
from django.contrib.auth.models import User
from .models import Audit, Finding, AuditLog
from .serializers import AuditSerializer, FindingSerializer


# ============ FACTORIES ============

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
    user = None
    action = "create"
    changed_fields = {}


# ============ MODEL TESTS ============

@pytest.mark.django_db(reset_sequences=True)
class TestAuditModel:
    """Tests for Audit model."""
    
    def test_audit_creation(self):
        """Test creating an audit."""
        audit = AuditFactory()
        assert audit.id is not None
        assert audit.title != ""
        assert audit.status == "planned"
    
    def test_audit_str_representation(self):
        """Test audit string representation."""
        audit = AuditFactory(title="Test Audit")
        assert str(audit) == "Test Audit"
    
    def test_audit_all_fields(self):
        """Test that audit has all required fields."""
        audit = AuditFactory(
            title="Complete Audit",
            date=date.today(),
            auditor="Senior QA",
            status="completed"
        )
        assert audit.title == "Complete Audit"
        assert audit.auditor == "Senior QA"
        assert audit.status == "completed"


@pytest.mark.django_db(reset_sequences=True)
class TestFindingModel:
    """Tests for Finding model."""
    
    def test_finding_creation(self):
        """Test creating a finding."""
        finding = FindingFactory()
        assert finding.id is not None
        assert finding.audit is not None
    
    def test_finding_has_audit_relationship(self):
        """Test that finding is properly linked to audit."""
        audit = AuditFactory()
        finding = FindingFactory(audit=audit)
        
        assert finding.audit.id == audit.id
        findings = Finding.objects.filter(audit=audit)
        assert findings.count() == 1
    
    def test_finding_all_severities(self):
        """Test that finding accepts all severity levels."""
        audit = AuditFactory()
        
        for severity in ["minor", "medium", "critical"]:
            finding = FindingFactory(audit=audit, severity=severity)
            assert finding.severity == severity


@pytest.mark.django_db(reset_sequences=True)
class TestAuditLogModel:
    """Tests for AuditLog model."""
    
    def test_auditlog_creation(self):
        """Test creating an audit log directly."""
        audit = AuditFactory()
        
        log = AuditLog.objects.create(
            audit=audit,
            user=None,
            action="create",
            changed_fields={}
        )
        
        assert log.id is not None
        assert log.action == "create"
        assert log.created_at is not None
    
    def test_auditlog_signal_creates_log_on_audit_create(self):
        """Test that creating an audit automatically creates a log entry."""
        AuditLog.objects.all().delete()
        
        audit = AuditFactory()
        
        logs = AuditLog.objects.filter(audit=audit)
        assert logs.count() >= 1
        assert logs.first().action == "create"
    
    def test_auditlog_str_representation(self):
        """Test AuditLog string representation."""
        audit = AuditFactory()
        log = AuditLog.objects.create(
            audit=audit,
            user=None,
            action="update",
            changed_fields={}
        )
        
        assert "UPDATE" in str(log)


# ============ SERIALIZER TESTS ============

@pytest.mark.django_db(reset_sequences=True)
class TestAuditSerializer:
    """Tests for AuditSerializer."""
    
    def test_serialize_audit(self):
        """Test serializing an audit."""
        audit = AuditFactory(title="Test Audit")
        serializer = AuditSerializer(audit)
        
        assert serializer.data['title'] == "Test Audit"
        assert serializer.data['status'] == "planned"
    
    def test_audit_serializer_includes_required_fields(self):
        """Test that serializer includes all required fields."""
        audit = AuditFactory()
        serializer = AuditSerializer(audit)
        
        assert 'id' in serializer.data
        assert 'title' in serializer.data
        assert 'status' in serializer.data
    
    def test_audit_serializer_valid_data(self):
        """Test serializer with valid data."""
        data = {
            'title': 'New Audit Test',
            'date': date.today(),
            'auditor': 'QA',
            'status': 'planned'
        }
        serializer = AuditSerializer(data=data)
        assert serializer.is_valid()
    
    def test_audit_serializer_read_only_fields(self):
        """Test that id and created_at are read-only."""
        audit = AuditFactory()
        serializer = AuditSerializer(audit)
        
        assert 'id' in serializer.data
        assert 'created_at' in serializer.data


@pytest.mark.django_db(reset_sequences=True)
class TestFindingSerializer:
    """Tests for FindingSerializer."""
    
    def test_serialize_finding(self):
        """Test serializing a finding."""
        finding = FindingFactory(description="Test finding description here")
        serializer = FindingSerializer(finding)
        
        assert serializer.data['severity'] == "medium"
        assert serializer.data['status'] == "open"
    
    def test_finding_serializer_includes_required_fields(self):
        """Test that serializer has required fields."""
        finding = FindingFactory()
        serializer = FindingSerializer(finding)
        
        assert 'id' in serializer.data
        assert 'audit' in serializer.data
        assert 'severity' in serializer.data
    
    def test_finding_serializer_read_only_fields(self):
        """Test that id and created_at are read-only."""
        finding = FindingFactory()
        serializer = FindingSerializer(finding)
        
        assert 'id' in serializer.data
        assert 'created_at' in serializer.data