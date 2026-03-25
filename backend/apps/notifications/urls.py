# apps/notifications/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.notifications.models import NotificationListView, MarkNotificationReadView
from apps.notifications.views import NotificationViewSet, EmailTemplateViewSet

router = DefaultRouter()
router.register(r'templates', EmailTemplateViewSet, basename='email-template')

urlpatterns = [
    path('', NotificationListView.as_view(), name='notifications-list'),
    path('<uuid:pk>/read/', MarkNotificationReadView.as_view(), name='notification-read'),
    path('', include(router.urls)),
]