# Generated by Django 3.1.7 on 2021-04-09 18:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0004_auto_20210409_1122'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='step',
            name='ingredients',
        ),
        migrations.AddField(
            model_name='ingredient',
            name='step',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, related_name='ingredients', to='recipes.step'),
            preserve_default=False,
        ),
    ]
