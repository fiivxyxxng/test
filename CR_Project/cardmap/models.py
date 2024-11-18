from django.db import models
from django.contrib.auth.hashers import make_password

class User(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=30, default="")
    password = models.CharField(max_length=128, default="")
    email = models.CharField(max_length=100, unique=True)
    age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=20, null=True, blank=True)
    monthly_income = models.IntegerField(null=True, blank=True)
    monthly_expenditure = models.IntegerField(null=True, blank=True)

    # last_login 필드 추가
    last_login = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'users'  # MySQL에 있는 테이블명과 동일하게 설정

    def __str__(self):
        return self.username

    def set_password(self, raw_password):
        self.password = make_password(raw_password)
        self.save()

    def check_password(self, raw_password):
        return self.password == make_password(raw_password)
