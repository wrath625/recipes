# Generated by Django 3.1.7 on 2021-04-09 17:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='keyword',
            old_name='created_at',
            new_name='created_time',
        ),
        migrations.RenameField(
            model_name='keyword',
            old_name='updated_at',
            new_name='updated_time',
        ),
        migrations.RenameField(
            model_name='recipe',
            old_name='created_at',
            new_name='created_time',
        ),
        migrations.RenameField(
            model_name='recipe',
            old_name='updated_at',
            new_name='updated_time',
        ),
        migrations.RenameField(
            model_name='shoppinglist',
            old_name='created_at',
            new_name='created_time',
        ),
    ]
