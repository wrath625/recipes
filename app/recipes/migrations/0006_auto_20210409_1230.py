# Generated by Django 3.1.7 on 2021-04-09 19:30

import autoslug.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0005_auto_20210409_1145'),
    ]

    operations = [
        migrations.AddField(
            model_name='food',
            name='slug',
            field=autoslug.fields.AutoSlugField(default='', editable=False, populate_from='name'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='keyword',
            name='slug',
            field=autoslug.fields.AutoSlugField(default='', editable=False, populate_from='name'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='recipe',
            name='slug',
            field=autoslug.fields.AutoSlugField(default='', editable=False, populate_from='name'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='unit',
            name='slug',
            field=autoslug.fields.AutoSlugField(default='', editable=False, populate_from='name'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='ingredient',
            name='order',
            field=models.IntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='procedure',
            name='order',
            field=models.IntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='shoppinglistentry',
            name='order',
            field=models.IntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='step',
            name='order',
            field=models.IntegerField(default=1),
        ),
    ]