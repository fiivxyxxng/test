# Generated by Django 4.2.16 on 2024-11-14 21:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cardmap', '0004_remove_user_name_user_username'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='age',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='gender',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='monthly_expenditure',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='monthly_income',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
