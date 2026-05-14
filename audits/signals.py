from django.db.models import signals
from django.dispatch import receiver
from .models import Audit, Finding, AuditLog


@receiver(signals.post_save, sender=Audit)
def log_audit_change(sender, instance, created, **kwargs):
    """Log when an Audit is created or updated."""
    action = 'create' if created else 'update'
    AuditLog.objects.create(
        audit=instance,
        user=None,  # Will be populated if we add user tracking later
        action=action,
        changed_fields={}
    )


@receiver(signals.post_save, sender=Finding)
def log_finding_change(sender, instance, created, **kwargs):
    """Log when a Finding is created or updated."""
    action = 'create' if created else 'update'
    AuditLog.objects.create(
        audit=instance.audit,
        user=None,
        action=action,
        changed_fields={}
    )


@receiver(signals.post_delete, sender=Finding)
def log_finding_delete(sender, instance, **kwargs):
    """Log when a Finding is deleted."""
    AuditLog.objects.create(
        audit=instance.audit,
        user=None,
        action='delete',
        changed_fields={}
    )
