# Generated by Django 4.2.5 on 2023-10-25 15:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('achats', '0003_achats_tl_achats_tt_achats_tv'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='achats',
            name='TL',
        ),
        migrations.RemoveField(
            model_name='achats',
            name='TT',
        ),
        migrations.RemoveField(
            model_name='achats',
            name='TV',
        ),
    ]
