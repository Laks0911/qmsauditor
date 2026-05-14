from django.db import models
from django.conf import settings

class Audit(models.Model):
    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('in_progress', 'In Progress'),
        ('complete', 'Complete'),
    ]
    title = models.CharField(max_length=200)
    date = models.DateField()
    auditor = models.CharField(max_length=100)
    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default='planned'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Finding(models.Model):
    SEVERITY_CHOICES = [
        ('minor', 'Minor'),
        ('major', 'Major'),
        ('critical', 'Critical'),
    ]
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
    ]
    audit = models.ForeignKey(
        Audit,
        on_delete=models.CASCADE,
        related_name='findings'
    )
    description = models.TextField()
    severity = models.CharField(
        max_length=50,
        choices=SEVERITY_CHOICES
    )
    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default='open'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.audit.title} — {self.severity}"
class AuditLog(models.Model):
    """
    Permanent log of all changes to Audit and Finding objects.
    This table is READ-ONLY - nobody can edit or delete entries.
    """
    
    ACTION_CHOICES = [
        ('create', 'Created'),
        ('update', 'Updated'),
        ('delete', 'Deleted'),
    ]
    
    audit = models.ForeignKey(
        Audit,
        on_delete=models.CASCADE,
        related_name='audit_logs',
        help_text="Which audit this log entry is for"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="Which user made the change"
    )
    action = models.CharField(
        max_length=10,
        choices=ACTION_CHOICES,
        help_text="What action was performed (create, update, delete)"
    )
    changed_fields = models.JSONField(
        default=dict,
        blank=True,
        help_text="Which fields changed: {'field_name': {'old': 'value1', 'new': 'value2'}}"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        help_text="When this change happened"
    )
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.action.upper()} by {self.user} on {self.created_at}"