from django.urls import path
from .views import (
    CandidateCreateView,
    CandidateDeleteView,
    CandidateDownloadResume,
    CandidateListView,
)

urlpatterns = [
    path("", CandidateListView.as_view(), name="candidate-list"),
    path("create", CandidateCreateView.as_view(), name="candidate-create"),
    path("<uuid:pk>/", CandidateDeleteView.as_view(), name="candidate-delete"),
    path(
        "<uuid:pk>/download-resume",
        CandidateDownloadResume.as_view(),
        name="candidate-download-resume",
    ),
]
