from django.urls import path
from .views import get_csrf_token, increment_counter
from . import views


app_name = "common"
urlpatterns = [
    path("", views.IndexView.as_view(), name="index"),
    path("increment/", increment_counter, name="increment"),
    path("csrf/", get_csrf_token, name="csrf"),
]
