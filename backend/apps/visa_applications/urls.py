from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.visa_applications.views import (
    VisaTypeViewSet,
    VisaApplicationViewSet
)

router = DefaultRouter()
router.register(r'types', VisaTypeViewSet, basename='visa-type')
router.register(r'applications', VisaApplicationViewSet, basename='visa-application')

urlpatterns = [
    path('', include(router.urls)),
    
]