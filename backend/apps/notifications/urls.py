# apps/notifications/urls.py
from django.urls import path
from apps.notifications.models import NotificationListView, MarkNotificationReadView

urlpatterns = [
    path('',           NotificationListView.as_view(),      name='notifications-list'),
    path('<uuid:pk>/read/', MarkNotificationReadView.as_view(), name='notification-read'),
]