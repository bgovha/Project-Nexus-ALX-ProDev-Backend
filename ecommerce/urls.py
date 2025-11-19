from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import RedirectView
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

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


# Temporarily reduce URL patterns to isolate a recursion error during system checks.
# Reintroduce API and docs routes incrementally to find the culprit if needed.
urlpatterns = [
    path('', RedirectView.as_view(pattern_name='schema-swagger-ui', permanent=False)),
    path('admin/', admin.site.urls),
    path('api/', include('products.urls')),
    path('api/auth/', include('authentication.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
