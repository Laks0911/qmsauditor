from django.db import models

# Create your models here.
from django.db import models

class Audit(models.Model):
    title = models.CharField(max_length=200)
    date = models.DateField()
    auditor = models.CharField(max_length=100)
    status = models.CharField(max_length=50, choices=[
        ('planned', 'Planned'),
        ('in_progress', 'In Progress'),
        ('complete', 'Complete'),
    ], default='planned')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Finding(models.Model):
    audit = models.ForeignKey(
        Audit,
        on_delete=models.CASCADE,
        related_name='findings'
    )
    description = models.TextField()
    severity = models.CharField(max_length=50, choices=[
        ('minor', 'Minor'),
        ('major', 'Major'),
        ('critical', 'Critical'),
    ])
    status = models.CharField(max_length=50, choices=[
        ('open', 'Open'),
        ('closed', 'Closed'),
    ], default='open')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.audit.title} — {self.severity}"

