from django.urls import path
from . import views

urlpatterns = [
    path("kakao/callback/", views.KakaoCallbackView.as_view(), name="kakao_callback"),
    path("profile/", views.ProfileView.as_view(), name="profile"),  # 프로필 저장 및 업데이트
    path("profile/delete/", views.ProfileDeleteView.as_view(), name="profile_delete"),  # 프로필 삭제
]