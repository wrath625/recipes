# Generated by Django 3.1.7 on 2021-04-14 22:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0009_recipe_image'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='recipe',
            options={'ordering': ['pk']},
        ),
        migrations.AlterField(
            model_name='recipe',
            name='created_by',
            field=models.CharField(max_length=128),
        ),
    ]
