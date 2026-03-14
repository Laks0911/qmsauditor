from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Audit, Finding

@admin.register(Audit)
class AuditAdmin(admin.ModelAdmin):
    list_display = ['title', 'date', 'auditor', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['title', 'auditor']

@admin.register(Finding)
class FindingAdmin(admin.ModelAdmin):
    list_display = ['audit', 'severity', 'status', 'created_at']
    list_filter = ['severity', 'status']
    search_fields = ['description']
