# Generated by Django 4.2.16 on 2024-11-13 08:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cardmap', '0002_rename_user_id_user_id_alter_user_age_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='user_name',
            new_name='name',
        ),
        migrations.RemoveField(
            model_name='user',
            name='user_pwd',
        ),
        migrations.AddField(
            model_name='user',
            name='last_login',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='password',
            field=models.CharField(default='', max_length=128),
        ),
        migrations.AlterField(
            model_name='user',
            name='age',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='user',
            name='gender',
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name='user',
            name='monthly_expenditure',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='user',
            name='monthly_income',
            field=models.IntegerField(),
        ),
    ]