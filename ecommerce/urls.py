from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import RedirectView
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.http import JsonResponse

schema_view = get_schema_view(
    openapi.Info(
        title="E-Commerce API",
        default_version='v1',
        description="API for managing e-commerce products and categories",
        contact=openapi.Contact(email="your-email@example.com"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)


"""Main URL configuration for the project.

Routes:
- /health/ - simple health check
- / - redirect to Swagger UI
- /admin/ - Django admin
- /api/ - product API
- /api/auth/ - authentication endpoints
- /swagger/ and /redoc/ - API docs
"""
urlpatterns = [
    path('health/', lambda request: JsonResponse({'status': 'ok'})),
    path('', RedirectView.as_view(pattern_name='schema-swagger-ui', permanent=False)),
    path('admin/', admin.site.urls),
    path('api/', include('products.urls')),
    path('api/auth/', include('authentication.urls')),
    # provide session auth views (login/logout/password management) so the
    # Swagger UI's "Login" / session authentication redirect (to
    # /accounts/login/?next=/swagger/) resolves instead of returning 404.
    path('accounts/', include('django.contrib.auth.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
