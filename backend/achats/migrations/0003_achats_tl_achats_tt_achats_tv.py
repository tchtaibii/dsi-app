# Generated by Django 4.2.5 on 2023-10-25 14:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('achats', '0002_remove_article_fourniseur_achats_fourniseur'),
    ]

    operations = [
        migrations.AddField(
            model_name='achats',
            name='TL',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='achats',
            name='TT',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='achats',
            name='TV',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
