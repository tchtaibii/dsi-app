from django.db import models


class Contrat(models.Model):
    name = models.CharField(max_length=60, blank=False, null=False)

    def __str__(self):
        return self.name


class TypeDArticle(models.Model):
    type = models.CharField(max_length=50, unique=True,
                            blank=False, null=False, primary_key=True)

    def __str__(self):
        return self.type


class Article(models.Model):
    code = models.CharField(max_length=30, blank=True)
    designation = models.TextField()
    contrat = models.ForeignKey(
        'Contrat', on_delete=models.PROTECT, null=True, blank=True)
    type = models.ForeignKey('TypeDArticle', on_delete=models.PROTECT)
    fourniseur = models.CharField(max_length=60, null=True, blank=True)
    prix_estimatif = models.IntegerField(blank=True, null=True)
    def __str__(self):
        return self.designation


class TypeDachat(models.Model):
    type = models.CharField(
        max_length=50, default='Contrat Cadre', blank=False, null=False)

    def __str__(self):
        return self.type


class SituationDachat(models.Model):
    situation = models.CharField(
        max_length=50, default='Non Validé', blank=False, null=False)

    def __str__(self):
        return self.situation


class Achat(models.Model):
    demandeur = models.CharField(max_length=70, blank=False, null=False)
    entité = models.CharField(max_length=30, blank=False, null=False)
    article = models.ForeignKey(
        'Article', on_delete=models.PROTECT, null=False, blank=False)
    ligne_bugetaire = models.CharField(max_length=30, null=False, blank=False)
    quantité = models.IntegerField(null=False, blank=False)
    DateDeCommande = models.DateField(null=False, blank=False)
    DA = models.CharField(max_length=30, null=True, blank=True)
    DateDA = models.DateField(null=True, blank=True)
    BC = models.CharField(max_length=30, null=True, blank=True)
    DateBC = models.DateField(null=True, blank=True)
    BC_File = models.FileField(upload_to='uploads/BC')
    typeDachat = models.ForeignKey(
        'TypeDachat', on_delete=models.PROTECT, null=False, blank=False)
    situation_d_achat = models.ForeignKey(
        'SituationDachat', on_delete=models.PROTECT, null=False, blank=False)
    BL = models.CharField(max_length=30, null=True, blank=True)
    DateBL = models.DateField(null=True, blank=True)
    BL_File = models.FileField(upload_to='uploads/BL')
    reste = models.IntegerField(blank=True)
    observation = models.TextField(blank=True, null=True)

    def __str__(self):
        return str(self.DateDeCommande)
