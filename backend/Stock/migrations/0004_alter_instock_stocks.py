# Generated by Django 4.2.5 on 2023-11-12 17:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Stock', '0003_alter_stocks_stocks'),
    ]

    operations = [
        migrations.AlterField(
            model_name='instock',
            name='stocks',
            field=models.ManyToManyField(related_name='related_instock', to='Stock.stocks'),
        ),
    ]