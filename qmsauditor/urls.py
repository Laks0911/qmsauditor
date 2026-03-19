from django.views.csrf import csrf_failure
from django.contrib import admin
from django.urls import path, include
from users.views import CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('csrf-failure/', csrf_failure, name='csrf_failure'),
    path('admin/', admin.site.urls),
    path('api/', include('audits.urls')),
    path('api/auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh'),
]

