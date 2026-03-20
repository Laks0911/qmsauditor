from rest_framework.permissions import BasePermission


class IsAdminOrAuditor(BasePermission):
    """
    Read access: all authenticated users.
    Write access: admin and auditor roles only.
    Viewers get read-only.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        # GET, HEAD, OPTIONS allowed for everyone
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        # POST, PUT, PATCH, DELETE — admin or auditor only
        return request.user.role in ['admin', 'auditor']
