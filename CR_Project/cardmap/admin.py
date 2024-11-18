from django.contrib import admin
from .models import User

class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'age', 'gender', 'monthly_income', 'monthly_expenditure')  # admin 페이지에 보여줄 컬럼들
    search_fields = ('username', 'email')  # 검색 기능 추가

admin.site.register(User, UserAdmin)