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


def create_default_articles(apps, schema_editor):
    Article = apps.get_model('achats', 'Article')
    TypeDArticle = apps.get_model('achats', 'TypeDArticle')
    contratM = apps.get_model('achats', 'Contrat')

    contrat_object = contratM.objects.get(name='Microdata UM6P')

    data = [
        ('503584', 'Dell Latitude 5420 XCTO Basei78G512', 'Laptop'),
        ('333620', 'Dell Wireless Keyboard Mouse KM7120W', 'Accessoire'),
        ('503585', 'Dell Latitude 5420 XCTO Basei58G512', 'Laptop'),
        ('503586', 'Dell Latitude 7420 XCTO_i7_16G_1T'), 'Laptop',
        ('503587', 'Dell Mobile Precision Workstation 7560 CTO', 'Laptop'),
        ('503588', 'Dell Mobile Precision Workstation 7760 CTO', 'Laptop'),
        ('503589', 'OptiPlex 5090 SFF XCTO_i5 8G _8G_512', 'Desktop'),
        ('503590', 'OptiPlex 5090 SFF XCTO_i7_8G_512', 'Desktop'),
        ('503591', 'OptiPlex 5090 SFF XCTO_i7_16g_512', 'Desktop'),
        ('503592', 'Precision 5820 Tower XCTO Base', 'Desktop'),
        ('503593', 'Precision 5820 Tower XCTO Base_Xeon_32G_SSD_1T SATA', 'Desktop'),
        ('333621', 'Dell Pro Slim Briefcase 15 - PO1520CS - Fits most laptops up to 15"', 'Backpack'),
        ('333622', 'Dell Pro Slim Backpack 15 - PO1520PS - Fits most laptops up to 15"', 'Backpack'),
        ('333623', 'Dell Pro Briefcase 14 (PO1420C)', 'Backpack'),
        ('503594', 'Dell Latitude 7320 XCTO Base_i7_16_1T', 'Laptop'),
        ('503595', 'Dell Latitude 7320 XCTO Base_i7_16_1T_2 in 1', 'Laptop'),
        ('333624', 'Dell DA310 USB-C Mobile Adapter', 'Accessoire'),
        ('333625', 'OptiPlex 7090 Micro XCTO_i7_16G_SSD 256', 'Desktop'),
        ('333626', 'Large Fusion™ Manual Height Adjustable Mobile AV Cart', 'Accessoire'),
        ('333627', 'Dell UltraSharp Webcam', 'Accessoire'),
        ('333628', 'C2G Mini DisplayPort to HDMI Active Adapter Converter 4K UHD - Black - video adapter - DisplayPort / HDMI', 'Accessoire'),
        ('333630', 'C2G USB C to USB Adapter - SuperSpeed USB Adapter - 5Gbps - F/M - USB adapter - USB-C (F) reversible to USB Type A (M) - USB 3.0 - 15.2 cm - molded - black', 'Accessoire'),
        ('333631', 'Dell Gaming Backpack 17, GM1720PM, Fits most laptops up to 17"', 'Backpack'),
        ('503597', 'Inspiron 16 Plus', 'Laptop'),
        ('333632', 'Vive Cosmos with Business Warranty and Services', 'Accessoire'),
        ('503598', 'Dell 22 Monitor - E2220H - 54.6cm (21.5") Black', 'Ecran'),
        ('503599', 'Dell UltraSharp 24 Monitor - U2422H – 60.47cm (23.8")', 'Ecran'),
        ('503600', 'Dell UltraSharp 27 Monitor- U2722D - 68.47cm (27")', 'Ecran'),
        ('503602', 'Dell 24 Video Conferencing Monitor - C2422HE - 60.47cm (23.8")', 'Ecran'),
        ('503603', 'Dell 27 Video Conferencing Monitor- C2722DE - 68.4cm(27")', 'Ecran'),
        ('333633', 'Dell Performance Dock WD19DCS, 240W', 'Accessoire'),
        ('503604', 'Dell 24 Monitor - E2422H - 60.5 cm (23.8")', 'Ecran'),
        ('503605', 'Dell 24 Monitor - P2422H - 60.5cm (23.8")', 'Ecran'),
        ('333634', 'Dell Dock WD19S, 130W', 'Ecran'),
        ('503606', 'Dell 24 Professional Monitor - P2421 - 61.13cm (24") Black', 'Ecran'),
        ('333635', 'Dell Curved USB-C Monitor-P3421W-86.5cm(34")', 'Ecran'),
        ('503607', 'Dell 22 Monitor – P2222H - 54.6cm (21.5")', 'Ecran'),
        ('503608', 'Dell 75 4K Interactive Touch Monitor - C7520QT - Black', 'Ecran'),
        ('503601', 'Dell 86 Monitor - C8621QT - 217.4cm (85.6") Black', 'Ecran'),
        ('333636', 'Dell Thunderbolt Dock WD19TBS, 180W', 'Ecran'),
        ('503609', 'Dell 32 USB-C Hub Monitor- P3223DE- 80.1cm(31.5”)', 'Ecran'),
        ('503610', 'Dell Alienware 38 Gaming Monitor | AW3821DW - 95.3cm (37.5")', 'Ecran')
    ]
    for code, designation, type in data:
        TypeDArticle.objects.get_or_create(type=type)
        Article.objects.create(
            code=code, designation=designation, contrat=contrat_object, type=TypeDArticle.objects.get(type=type))

    contrat_object = contratM.objects.get(name='Microdata OCP')
    data = [
        ("505328", "PC ULTRAPORTABLE", 'Laptop'),
        ("505329", "PC ULTRAPORTABLE 2IN1", 'Laptop'),
        ("505330", "PC PORTABLE STD 1 (i7)", 'Laptop'),
        ("505331", "PC PORTABLE STD 2 (i5)", 'Laptop'),
        ("505332", "PC Portable Performant", 'Laptop'),
        ("505333", "MICRO ORDINATEUR FIXE PERFORMANT,", 'Desktop'),
        ("505334", "MICRO ORDINATEUR FIXE", 'Desktop'),
        ("500194", "ECRAN 24", 'Ecran'),
        ("503717", "ECRAN 27", 'Ecran'),
        ("303483", "SAC A DOS", 'Backpack'),
        ("311201", "Clavier (Français/Arabe) et Souris Sans fil", 'Accessoire'),
        ("342064", "Station d'accueil", 'Accessoire'),
    ]
    for code, designation, type in data:
        TypeDArticle.objects.get_or_create(type=type)
        Article.objects.create(
            code=code, designation=designation, contrat=contrat_object, type=TypeDArticle.objects.get(type=type))

    contrat_object = contratM.objects.get(name='Munisys')
    data = [
        ("504172", "Laptop Standard Version 1", 'Laptop'),
        ("504173", "Laptop Standard Version 2", 'Laptop'),
        ("504174", "Laptop Leger", 'Laptop'),
        ("504175", "Laptop Ultra leger", 'Laptop'),
        ("504176", "Mobile Workstation", 'Laptop'),
        ("504177", "Desktop SFF version 1", 'Desktop'),
        ("504178", "Desktop SFF version 2", 'Desktop'),
        ("504179", "Desktop SFF version 3", 'Desktop'),
        ("504180", "Desktop USFF version 4", 'Desktop'),
        ("314854", "Monitor 22\"", "Ecran"),
        ("502295", "Monitor 24\"", "Ecran"),
        ("501901", "Monitor 27\"", "Ecran"),
        ("504181", "Monitor 86 interactive", 'Ecran'),
        ("504182", "Monitor T75 interactive", 'Ecran'),
        ("504183", "Dock Station :", 'Accessoire'),
        ("337925", "Cartable Laptop 15\"", 'Backpack'),
        ("337926", "Sac à Dos 15\"", 'Backpack'),
        ("333471", "Pochette PC 14\"", 'Accessoire'),
        ("337927", "Sac à Dos 17\"", 'Backpack'),
        ("337928", "Wireless Keyboard & Mouse (French)", 'Accessoire'),
    ]
    for code, designation, type in data:
        TypeDArticle.objects.get_or_create(type=type)
        Article.objects.create(
            code=code, designation=designation, contrat=contrat_object, type=TypeDArticle.objects.get(type=type))


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
        migrations.RunPython(create_default_articles),
    ]
