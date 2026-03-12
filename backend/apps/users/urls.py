from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.users.views import (
    RegisterView,
    LoginView,
    LogoutView,
    MyProfileView,
    ChangePasswordView,
    UserViewSet,
    VerifyEmailView,  # <-- ajouté
)

router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')

urlpatterns = [
    # Authentification
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
     path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/verify-email/', VerifyEmailView.as_view(), name='verify-email'),  # <-- ajouté

    # Profil utilisateur
    path('profile/', MyProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),

    # Gestion des utilisateurs (admin)
    path('', include(router.urls)),
]