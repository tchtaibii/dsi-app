# Generated by Django 4.2.5 on 2023-11-12 15:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Stock', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='stock',
            name='DateDaffectation',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='stock',
            name='affected_by',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]