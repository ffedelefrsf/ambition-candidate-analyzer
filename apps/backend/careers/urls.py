from django.urls import path
from .views import (
    CareerFindCandidate,
    CareerListView,
    CareerCreateView,
    CareerDeleteView,
)

urlpatterns = [
    path("", CareerListView.as_view(), name="career-list"),
    path("create/", CareerCreateView.as_view(), name="career-create"),
    path("<uuid:pk>/", CareerDeleteView.as_view(), name="career-delete"),
    path(
        "<uuid:pk>/find-best-candidate",
        CareerFindCandidate.as_view(),
        name="career-find-candidate",
    ),
]
