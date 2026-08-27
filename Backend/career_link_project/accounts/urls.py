from django.urls import path


from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    
)

from accounts  import views


urlpatterns = [
    path("register/", views.RegisterView.as_view(), name="register"),
    path("login/", views.LoginView.as_view(), name="login"),
    path("login/refresh/", TokenRefreshView.as_view(), name="login-refresh"),
    path("me/", views.MeView.as_view(), name="me"),

    path("forgot/password/",views.ForgetPasswordView.as_view(),name="forgot-password"),

    path ("reset/password/",views.ResetPasswordView.as_view(),name="reset-password"),

    path("verify/otp/",views.VerifyOTPView.as_view(),name="verify-otp"),
    path("delete/sendotp/",views.SendDeleteOTPView.as_view(),name="delete-otp"),

    path(
    "pr/verify/otp/",views.
    DeleteAccountView.as_view(),
),
    path(
    "verify/resend/otp/",views.
    ResendVerificationOTPView.as_view(),
),

]
