from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.visa_applications.views import (
    VisaTypeViewSet,
    VisaApplicationViewSet
)
from apps.visa_applications.views_dynamic import (
    ImmigrationStatsView,
    ImmigrationListView,
    ImmigrationDecisionView,
    EmbassyListView,
    EmbassyOpinionView,
    BorderVerificationView,
    BorderCheckInView,
    BorderStatsView,
    BorderHistoryListView,
    SecurityAlertListView
)

router = DefaultRouter()
router.register(r'types', VisaTypeViewSet, basename='visa-type')
router.register(r'applications', VisaApplicationViewSet, basename='visa-application')

urlpatterns = [
    path('', include(router.urls)),
    
    # Immigration
    path('immigration/stats/', ImmigrationStatsView.as_view(), name='immigration-stats'),
    path('immigration/applications/', ImmigrationListView.as_view(), name='immigration-list'),
    path('immigration/applications/<uuid:pk>/decision/', ImmigrationDecisionView.as_view(), name='immigration-decision'),
    
    # Embassy
    path('embassy/applications/', EmbassyListView.as_view(), name='embassy-list'),
    path('embassy/applications/<uuid:pk>/opinion/', EmbassyOpinionView.as_view(), name='embassy-opinion'),

    # Border Control
    path('border/stats/', BorderStatsView.as_view(), name='border-stats'),
    path('border/verify/', BorderVerificationView.as_view(), name='border-verify'),
    path('border/history/', BorderHistoryListView.as_view(), name='border-history'),
    path('border/alerts/', SecurityAlertListView.as_view(), name='border-alerts'),
]