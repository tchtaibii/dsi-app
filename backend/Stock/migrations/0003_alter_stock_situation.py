# Generated by Django 4.2.5 on 2023-11-16 13:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Stock', '0002_alter_stock_datedaffectation'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stock',
            name='situation',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='Stock.stocksituation'),
        ),
    ]
