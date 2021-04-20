# Generated by Django 3.1.7 on 2021-03-31 22:15

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Food',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128, validators=[django.core.validators.MinLengthValidator(1)])),
                ('ignore_shopping', models.BooleanField(default=False)),
                ('description', models.TextField(blank=True, default='')),
            ],
        ),
        migrations.CreateModel(
            name='Ingredient',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=16, default=0, max_digits=32)),
                ('note', models.CharField(blank=True, max_length=256, null=True)),
                ('no_amount', models.BooleanField(default=False)),
                ('order', models.IntegerField(default=0)),
                ('food', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='recipes.food')),
            ],
            options={
                'ordering': ['order', 'pk'],
            },
        ),
        migrations.CreateModel(
            name='Keyword',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64)),
                ('icon', models.CharField(blank=True, max_length=16, null=True)),
                ('description', models.TextField(blank=True, default='')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Recipe',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128)),
                ('description', models.CharField(blank=True, max_length=512, null=True)),
                ('servings', models.IntegerField(default=1)),
                ('servings_text', models.CharField(blank=True, default='', max_length=32)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_deleted', models.BooleanField(default=False)),
                ('deleted_time', models.DateTimeField(blank=True, null=True)),
                ('working_time', models.IntegerField(default=0)),
                ('waiting_time', models.IntegerField(default=0)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
                ('deleted_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('keywords', models.ManyToManyField(blank=True, to='recipes.Keyword')),
            ],
        ),
        migrations.CreateModel(
            name='Unit',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128, validators=[django.core.validators.MinLengthValidator(1)])),
                ('description', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Step',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, default='', max_length=128)),
                ('type', models.CharField(choices=[('TEXT', 'Text'), ('TIME', 'Time')], default='TEXT', max_length=16)),
                ('instruction', models.TextField(blank=True)),
                ('time', models.IntegerField(blank=True, default=0)),
                ('order', models.IntegerField(default=0)),
                ('ingredients', models.ManyToManyField(blank=True, to='recipes.Ingredient')),
            ],
            options={
                'ordering': ['order', 'pk'],
            },
        ),
        migrations.CreateModel(
            name='ShoppingListRecipe',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('servings', models.DecimalField(decimal_places=4, default=1, max_digits=8)),
                ('recipe', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='recipes.recipe')),
            ],
        ),
        migrations.CreateModel(
            name='ShoppingListEntry',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=16, default=0, max_digits=32)),
                ('order', models.IntegerField(default=0)),
                ('checked', models.BooleanField(default=False)),
                ('food', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='recipes.food')),
                ('list_recipe', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='recipes.shoppinglistrecipe')),
                ('unit', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='recipes.unit')),
            ],
        ),
        migrations.CreateModel(
            name='ShoppingList',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('note', models.TextField(blank=True, null=True)),
                ('finished', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('entries', models.ManyToManyField(blank=True, to='recipes.ShoppingListEntry')),
                ('recipes', models.ManyToManyField(blank=True, to='recipes.ShoppingListRecipe')),
                ('shared', models.ManyToManyField(blank=True, related_name='list_share', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='recipe',
            name='steps',
            field=models.ManyToManyField(to='recipes.Step'),
        ),
        migrations.AddField(
            model_name='ingredient',
            name='unit',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='recipes.unit'),
        ),
    ]