from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'age', 'gender', 'monthly_income', 'monthly_expenditure']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True}
        }

    def validate_monthly_income(self, value):
        if value < 0:
            raise serializers.ValidationError("월별 수입은 0 이상이어야 합니다.")
        return value

    def validate_monthly_expenditure(self, value):
        if value < 0:
            raise serializers.ValidationError("월별 지출은 0 이상이어야 합니다.")
        return value

    def update(self, instance, validated_data):
        # 비밀번호를 별도로 처리하여 해싱
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.password = make_password(password)
        instance.save()
        return instance

    def create(self, validated_data):
        # 사용자 생성 시 비밀번호 해싱 처리
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)