
from django.db import migrations, models
import django.db.models.deletion


def create_default_situation_stock(apps, schema_editor):
    SituationS = apps.get_model('Stock', 'StockSituation')
    SituationS.objects.create(situation='NV')
    SituationS.objects.create(situation="RN")
    SituationS.objects.create(situation='DT')
    SituationS.objects.create(situation="ENT")
    SituationS.objects.create(situation="DP")
    SituationS.objects.create(situation="Présentation")
    SituationS.objects.create(situation="ST")


def create_default_etat_stock(apps, schema_editor):
    EtatS = apps.get_model('Stock', 'StockEtat')
    EtatS.objects.create(etat='Stock')
    EtatS.objects.create(etat="Affecté")


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('achats', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Stock',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('NomPrenom', models.CharField(
                    blank=True, max_length=100, null=True)),
                ('Fonction', models.CharField(blank=True, max_length=50, null=True)),
                ('DateArrivage', models.DateField(blank=True, null=True)),
                ('DateDaffectation', models.DateField(blank=True, null=True)),
                ('serviceTag', models.CharField(
                    blank=True, max_length=50, null=True)),
                ('affected_by', models.CharField(
                    blank=True, max_length=200, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='StockEtat',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('etat', models.CharField(default='Stock',
                 max_length=50, blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='StockSituation',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('situation', models.CharField(default=None,
                 max_length=50, blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Stocks',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('designation', models.TextField()),
                ('mark', models.TextField(default='')),
                ('modele', models.TextField(default='')),
                ('quantité', models.IntegerField(default=0)),
                ('affecté', models.IntegerField(default=0)),
                ('stocks', models.ManyToManyField(
                    related_name='related_stocks', to='Stock.stock')),
                ('type', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='achats.typedarticle')),
            ],
        ),
        migrations.AddField(
            model_name='stock',
            name='etat',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to='Stock.stocketat'),
        ),
        migrations.AddField(
            model_name='stock',
            name='situation',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to='Stock.stocksituation'),
        ),
        migrations.CreateModel(
            name='inStock',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('BC', models.CharField(max_length=30)),
                ('fourniseur', models.CharField(
                    blank=True, max_length=30, null=True)),
                ('entité', models.CharField(max_length=50)),
                ('stocks', models.ManyToManyField(
                    related_name='related_instock', to='Stock.stocks')),
            ],
        ),
        migrations.RunPython(create_default_situation_stock),
        migrations.RunPython(create_default_etat_stock),
    ]
