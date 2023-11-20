from django.urls import path
from . import views
# from users.views import AvatarUpdateAPIView
from django.contrib.auth import views as auth_views
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from .views import MyProtectedView


urlpatterns = [
    path('register/', views.user_registration, name='user-registration'),
    path('login/', views.user_login, name='user-login'),
    path('update/', views.update_login, name='user-login'),
    # path('avatar_upload/', AvatarUpdateAPIView.as_view(), name='avatar-upload'),
    path('get_profile/<str:id>', views.get_profile, name='get_profile'),
    path('update_password/', views.update_password, name='update_password'),
    path('all/', views.get_all_profile, name='get_all_profile'),
    path('my/', views.my_info, name='get_my_info'),
    path('file_upload_view/', views.file_upload_view, name='file_upload_view'),
    path('update_session/<str:id>', views.update_session, name='update_session'),

    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/access/', TokenObtainPairView.as_view(), name='token_access'),
    path('my-protected-endpoint/', MyProtectedView.as_view(),
         name='my_protected_endpoint'),

    # Define other app-specific URL patterns here
]
