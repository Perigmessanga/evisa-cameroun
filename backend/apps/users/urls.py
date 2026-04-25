from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.users.views import (
    RegisterView,
    LoginView,
    LogoutView,
    MyProfileView,
    ChangePasswordView,
    UserViewSet,
    VerifyEmailView,
    ForgotPasswordView,
    ResetPasswordView,
)

from apps.users.two_factor_views import (
    TwoFactorSetupView,
    TwoFactorVerifyView,
    TwoFactorDisableView
)

router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')

urlpatterns = [
    # Authentification
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
     path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('auth/forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('auth/reset-password/', ResetPasswordView.as_view(), name='reset-password'),

    # Profil utilisateur
    path('profile/', MyProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),

    # 2FA
    path('2fa/setup/', TwoFactorSetupView.as_view(), name='2fa-setup'),
    path('2fa/verify/', TwoFactorVerifyView.as_view(), name='2fa-verify'),
    path('2fa/disable/', TwoFactorDisableView.as_view(), name='2fa-disable'),

    # Gestion des utilisateurs (admin)
    path('', include(router.urls)),
]