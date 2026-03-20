from rest_framework.routers import DefaultRouter
from .views import AuditViewSet, FindingViewSet

router = DefaultRouter()
router.register(r'audits', AuditViewSet)
router.register(r'findings', FindingViewSet, basename='finding')

urlpatterns = router.urls
