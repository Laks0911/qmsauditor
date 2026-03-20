from django.db import models

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
    