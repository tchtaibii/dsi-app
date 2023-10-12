# Generated by Django 4.2.5 on 2023-10-06 14:45

from django.db import migrations, models
import django.db.models.deletion


def create_default_contrat(apps, schema_editor):
    Contrat = apps.get_model('achats', 'Contrat')
    Contrat.objects.create(name='Microdata OCP')
    Contrat.objects.create(name='Microdata UM6P')
    Contrat.objects.create(name="Munisys")


def create_default_type_dachat(apps, schema_editor):
    typedachat = apps.get_model('achats', 'TypeDachat')
    typedachat.objects.create(type='Contrat Cadre')
    typedachat.objects.create(type='Achat Direct')
    typedachat.objects.create(type="Achat d'offre")
    typedachat.objects.create(type="Achat en ligne")


def create_default_situation_dachat(apps, schema_editor):
    situation_dachat = apps.get_model('achats', 'SituationDachat')
    situation_dachat.objects.create(situation='Nouveau')
    situation_dachat.objects.create(situation='En cours de traitement')
    situation_dachat.objects.create(situation="En cours de livraison")
    situation_dachat.objects.create(situation="Livré")
    situation_dachat.objects.create(situation="Livraison partielle")


def create_TypeArticle(apps, schema_editor):
    TypeDArticle = apps.get_model('achats', 'TypeDArticle')
    TypeDArticle.objects.create(type='Laptop')


def create_default_articles(apps, schema_editor):
    Article = apps.get_model('achats', 'Article')
    TypeDArticle = apps.get_model('achats', 'TypeDArticle')
    contratM = apps.get_model('achats', 'Contrat')

    contrat_object = contratM.objects.get(name='Microdata UM6P')
    laptop_type = TypeDArticle.objects.get(
        type='Laptop')

    data = [
        ('503584', 'Dell Latitude 5420 XCTO Basei78G512'),
        ('333620', 'Dell Wireless Keyboard Mouse KM7120W'),
        ('503585', 'Dell Latitude 5420 XCTO Basei58G512'),
        ('503586', 'Dell Latitude 7420 XCTO_i7_16G_1T'),
        ('503587', 'Dell Mobile Precision Workstation 7560 CTO'),
        ('503588', 'Dell Mobile Precision Workstation 7760 CTO'),
        ('503589', 'OptiPlex 5090 SFF XCTO_i5 8G _8G_512'),
        ('503590', 'OptiPlex 5090 SFF XCTO_i7_8G_512'),
        ('503591', 'OptiPlex 5090 SFF XCTO_i7_16g_512'),
        ('503592', 'Precision 5820 Tower XCTO Base'),
        ('503593', 'Precision 5820 Tower XCTO Base_Xeon_32G_SSD_1T SATA'),
        ('333621', 'Dell Pro Slim Briefcase 15 - PO1520CS - Fits most laptops up to 15"'),
        ('333622', 'Dell Pro Slim Backpack 15 - PO1520PS - Fits most laptops up to 15"'),
        ('333623', 'Dell Pro Briefcase 14 (PO1420C)'),
        ('503594', 'Dell Latitude 7320 XCTO Base_i7_16_1T'),
        ('503595', 'Dell Latitude 7320 XCTO Base_i7_16_1T_2 in 1'),
        ('333624', 'Dell DA310 USB-C Mobile Adapter'),
        ('333625', 'OptiPlex 7090 Micro XCTO_i7_16G_SSD 256'),
        ('333626', 'Large Fusion™ Manual Height Adjustable Mobile AV Cart'),
        ('333627', 'Dell UltraSharp Webcam'),
        ('333628', 'C2G Mini DisplayPort to HDMI Active Adapter Converter 4K UHD - Black - video adapter - DisplayPort / HDMI'),
        ('333630', 'C2G USB C to USB Adapter - SuperSpeed USB Adapter - 5Gbps - F/M - USB adapter - USB-C (F) reversible to USB Type A (M) - USB 3.0 - 15.2 cm - molded - black'),
        ('333631', 'Dell Gaming Backpack 17, GM1720PM, Fits most laptops up to 17"'),
        ('503597', 'Inspiron 16 Plus'),
        ('333632', 'Vive Cosmos with Business Warranty and Services'),
        ('503598', 'Dell 22 Monitor - E2220H - 54.6cm (21.5") Black'),
        ('503599', 'Dell UltraSharp 24 Monitor - U2422H – 60.47cm (23.8")'),
        ('503600', 'Dell UltraSharp 27 Monitor- U2722D - 68.47cm (27")'),
        ('503602', 'Dell 24 Video Conferencing Monitor - C2422HE - 60.47cm (23.8")'),
        ('503603', 'Dell 27 Video Conferencing Monitor- C2722DE - 68.4cm(27")'),
        ('333633', 'Dell Performance Dock WD19DCS, 240W'),
        ('503604', 'Dell 24 Monitor - E2422H - 60.5 cm (23.8")'),
        ('503605', 'Dell 24 Monitor - P2422H - 60.5cm (23.8")'),
        ('333634', 'Dell Dock WD19S, 130W'),
        ('503606', 'Dell 24 Professional Monitor - P2421 - 61.13cm (24") Black'),
        ('333635', 'Dell Curved USB-C Monitor-P3421W-86.5cm(34")'),
        ('503607', 'Dell 22 Monitor – P2222H - 54.6cm (21.5")'),
        ('503608', 'Dell 75 4K Interactive Touch Monitor - C7520QT - Black'),
        ('503601', 'Dell 86 Monitor - C8621QT - 217.4cm (85.6") Black'),
        ('333636', 'Dell Thunderbolt Dock WD19TBS, 180W'),
        ('503609', 'Dell 32 USB-C Hub Monitor- P3223DE- 80.1cm(31.5”)'),
        ('503610', 'Dell Alienware 38 Gaming Monitor | AW3821DW - 95.3cm (37.5")')
    ]

    for code, designation in data:
        Article.objects.create(
            code=code, designation=designation, contrat=contrat_object, type=laptop_type)

    contrat_object = contratM.objects.get(name='Microdata OCP')
    data = [
        ("505328", "PC ULTRAPORTABLE"),
        ("505329", "PC ULTRAPORTABLE 2IN1"),
        ("505330", "PC PORTABLE STD 1 (i7)"),
        ("505331", "PC PORTABLE STD 2 (i5)"),
        ("505332", "PC Portable Performant"),
        ("505333", "MICRO ORDINATEUR FIXE PERFORMANT"),
        ("505334", "MICRO ORDINATEUR FIXE"),
        ("500194", "ECRAN 24"),
        ("503717", "ECRAN 27"),
        ("303483", "SAC A DOS"),
        ("311201", "Clavier (Français/Arabe) et Souris Sans fil"),
        ("342064", "Station d'accueil"),
    ]
    for code, designation in data:
        Article.objects.create(
            code=code, designation=designation, contrat=contrat_object, type=laptop_type)

    contrat_object = contratM.objects.get(name='Munisys')
    data = [
        ("504172", "Laptop Standard Version 1"),
        ("504173", "Laptop Standard Version 2"),
        ("504174", "Laptop Leger"),
        ("504175", "Laptop Ultra leger"),
        ("504176", "Mobile Workstation"),
        ("504177", "Desktop SFF version 1"),
        ("504178", "Desktop SFF version 2"),
        ("504179", "Desktop SFF version 3"),
        ("504180", "Desktop USFF version 4"),
        ("314854", "Monitor 22\""),
        ("502295", "Monitor 24\""),
        ("501901", "Monitor 27\""),
        ("504181", "Monitor 86 interactive"),
        ("504182", "Monitor T75 interactive"),
        ("504183", "Dock Station :"),
        ("337925", "Cartable Laptop 15\""),
        ("337926", "Sac à Dos 15\""),
        ("333471", "Pochette PC 14\""),
        ("337927", "Sac à Dos 17\""),
        ("337928", "Wireless Keyboard & Mouse (French)"),
    ]

    for code, designation in data:
        Article.objects.create(
            code=code, designation=designation, contrat=contrat_object, type=laptop_type)


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Contrat',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=60)),
            ],
        ),
        migrations.CreateModel(
            name='SituationDachat',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('situation', models.CharField(default='Non Validé', max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='TypeDachat',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(default='Contrat Cadre', max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='TypeDArticle',
            fields=[
                ('type', models.CharField(max_length=50,
                 primary_key=True, serialize=False, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Article',
            fields=[
                ('code', models.CharField(max_length=30,
                 primary_key=True, serialize=False)),
                ('designation', models.TextField(blank=True, null=True)),
                ('fourniseur', models.CharField(
                    blank=True, max_length=60, null=True)),
                ('prix_estimatif', models.IntegerField(blank=True, null=True)),
                ('contrat', models.ForeignKey(blank=True, null=True,
                 on_delete=django.db.models.deletion.PROTECT, to='achats.contrat')),
                ('type', models.ForeignKey(
                    on_delete=django.db.models.deletion.PROTECT, to='achats.typedarticle')),
            ],
        ),
        migrations.CreateModel(
            name='Achat',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('demandeur', models.CharField(max_length=70)),
                ('entité', models.CharField(max_length=30)),
                ('ligne_bugetaire', models.CharField(max_length=30)),
                ('quantité', models.IntegerField()),
                ('DateDeCommande', models.DateField()),
                ('DA', models.CharField(blank=True, max_length=30, null=True)),
                ('DateDA', models.DateField(blank=True, null=True)),
                ('BC', models.CharField(blank=True, max_length=30, null=True)),
                ('DateBC', models.DateField(blank=True, null=True)),
                ('BC_File', models.FileField(
                    blank=True, null=True, upload_to='uploads/BC')),
                ('BL', models.CharField(blank=True, max_length=30, null=True)),
                ('DateBL', models.DateField(blank=True, null=True)),
                ('BL_File', models.FileField(
                    blank=True, null=True, upload_to='uploads/BL')),
                ('reste', models.IntegerField(blank=True, null=True)),
                ('observation', models.TextField(blank=True, null=True)),
                ('article', models.ForeignKey(
                    on_delete=django.db.models.deletion.PROTECT, to='achats.article')),
                ('situation_d_achat', models.ForeignKey(
                    on_delete=django.db.models.deletion.PROTECT, to='achats.situationdachat')),
                ('typeDachat', models.ForeignKey(
                    on_delete=django.db.models.deletion.PROTECT, to='achats.typedachat')),
            ],
        ),
        migrations.RunPython(create_default_contrat),
        migrations.RunPython(create_default_type_dachat),
        migrations.RunPython(create_default_situation_dachat),
        migrations.RunPython(create_TypeArticle),
        migrations.RunPython(create_default_articles),
    ]
