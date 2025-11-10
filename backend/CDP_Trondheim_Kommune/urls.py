from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView

import django_js_reverse.views
from common.routes import routes as common_routes
from common.views import ChecklistAPIView
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from rest_framework.routers import DefaultRouter
from users.routes import routes as users_routes


router = DefaultRouter()

routes = common_routes + users_routes
for route in routes:
    router.register(route["regex"], route["viewset"], basename=route["basename"])

urlpatterns = [
    path("", include("common.urls"), name="common"),
    path("admin/", admin.site.urls, name="admin"),
    path("admin/defender/", include("defender.urls")),
    path("jsreverse/", django_js_reverse.views.urls_js, name="js_reverse"),
    path("api/", include(router.urls), name="api"),
    path("api/checklist/", ChecklistAPIView.as_view(), name="checklist"),
    # drf-spectacular
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/schema/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
]

# React SPA fallback route
urlpatterns += [
    re_path(
        r"^(?!api/|admin/|static/|media/).*$",
        TemplateView.as_view(template_name="common/index.html"),
        name="react-entry",
    ),
]
