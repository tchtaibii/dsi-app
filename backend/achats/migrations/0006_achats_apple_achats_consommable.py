# Generated by Django 4.2.5 on 2023-10-29 12:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('achats', '0005_achats_tl_achats_tt_achats_tv'),
    ]

    operations = [
        migrations.AddField(
            model_name='achats',
            name='apple',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='achats',
            name='consommable',
            field=models.BooleanField(default=False),
        ),
    ]
