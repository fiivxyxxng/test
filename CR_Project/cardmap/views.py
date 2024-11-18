from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
import requests
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from .serializers import UserSerializer
from django.shortcuts import redirect

User = get_user_model()

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True) # 부분 업데이트 허용
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "프로필 저장 완료"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        request.user.delete()
        return Response({"message": "회원 탈퇴 완료"}, status=status.HTTP_204_NO_CONTENT)


class KakaoCallbackView(APIView):

    def get(self, request):
        code = request.GET.get("code")
        if not code:
            return Response({"error": "No code provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Access Token 요청
        token_url = "https://kauth.kakao.com/oauth/token"
        token_data = {
            "grant_type": "authorization_code",
            "client_id": "e66e5234504f77fe52966a18dc0ebeea",
            "redirect_uri": "http://127.0.0.1:8000/api/v1/users/kakao/callback",
            "code": code,
        }
        token_response = requests.post(token_url, data=token_data, headers={"Content-Type": "application/x-www-form-urlencoded"})

        if token_response.status_code != 200:
            return Response({"error": "Failed to retrieve access token", "details": token_response.json()}, status=status.HTTP_400_BAD_REQUEST)

        access_token = token_response.json().get("access_token")
        if not access_token:
            return Response({"error": "Failed to retrieve access token from response"}, status=status.HTTP_400_BAD_REQUEST)

        # 유저 정보 가져오기
        user_info_response = requests.get(
            "https://kapi.kakao.com/v2/user/me",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        user_info_json = user_info_response.json()
        kakao_account = user_info_json.get("kakao_account")
        email = kakao_account.get("email") if kakao_account else None
        if not email:
            return Response({"error": "Email is required but not provided by Kakao"}, status=status.HTTP_400_BAD_REQUEST)

        # 사용자 닉네임 가져오기
        nickname = user_info_json.get("properties", {}).get("nickname") or kakao_account.get("profile", {}).get("nickname") or ""

        # 유저 정보 저장 또는 업데이트
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "username": nickname,
                "password": make_password(""),
            }
        )
        if created:
            user.set_unusable_password()  # 소셜 로그인 유저에게 비밀번호를 설정하지 않음
            user.save()

        # 로그인 성공 후 홈 화면으로 리디렉션할 응답 생성
        # response = redirect("http://localhost:3000")  # 프론트엔드 홈 화면으로 리디렉션

        # JWT 토큰 생성
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        # JSON 응답으로 access_token과 refresh_token을 전송
        response = JsonResponse({
            "access_token": access_token,
            "refresh_token": refresh_token,
            "code": code,
            "redirect_url": "http://localhost:3000"  # 프론트엔드 홈 URL
        })

        # 쿠키 설정: access_token과 refresh_token을 쿠키로 설정
        response.set_cookie(
            "access_token",
            access_token,
            httponly=False,  # JavaScript에서 접근 가능하도록 httponly=False
            path="/",  # 전체 경로에서 유효하도록 설정
            max_age=60 * 60,  # 쿠키 유효 시간 설정 (예: 1시간)
            samesite="None",
            secure=True  # https 환경에서만 작동
        )
        response.set_cookie(
            "refresh_token",
            refresh_token,
            httponly=False,
            path="/",
            max_age=60 * 60 * 24,  # 쿠키 유효 시간 설정 (예: 1일)
            samesite="None",
            secure=True
        )

        return response