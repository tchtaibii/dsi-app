# Generated by Django 4.2.5 on 2023-11-03 14:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='customuser',
            old_name='is_achat_manager',
            new_name='is_reception',
        ),
    ]
