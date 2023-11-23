from datetime import datetime
import logging
from django.utils import timezone
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
    code = models.CharField(max_length=30, null=True, blank=True)
    designation = models.TextField(null=True, blank=True)
    contrat = models.ForeignKey(
        'Contrat', on_delete=models.PROTECT, null=True, blank=True)
    type = models.ForeignKey(
        'TypeDArticle', on_delete=models.PROTECT, null=True, blank=True)
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
        max_length=50, blank=False, null=False)

    def __str__(self):
        return self.situation


class Achat(models.Model):
    quantité = models.IntegerField(null=False, blank=False)
    valable = models.IntegerField(default=0, null=False, blank=False)
    reste = models.IntegerField(blank=True, null=True)
    article = models.ForeignKey(
        'Article', on_delete=models.PROTECT, null=False, blank=False)

    def __str__(self):
        return self.article.designation if self.article else 'Achat object without associated article'


logger = logging.getLogger(__name__)


class Achats(models.Model):
    demandeur = models.CharField(max_length=70, blank=False, null=False)
    entité = models.CharField(max_length=30, blank=False, null=False)
    achat = models.ManyToManyField('Achat')
    ligne_bugetaire = models.CharField(max_length=30, null=False, blank=False)
    DateDeCommande = models.DateField(null=False, blank=False)
    DA = models.CharField(max_length=30, null=True, blank=True)
    DateDA = models.DateField(null=True, blank=True)
    BC = models.CharField(max_length=30, null=True, blank=True)
    DateBC = models.DateField(null=True, blank=True)
    BC_File = models.FileField(upload_to='uploads/BC', null=True, blank=True)
    typeDachat = models.ForeignKey(
        'TypeDachat', on_delete=models.PROTECT, null=False, blank=False)
    situation_d_achat = models.ForeignKey(
        'SituationDachat', on_delete=models.PROTECT, null=False, blank=False)
    BL = models.CharField(max_length=30, null=True, blank=True)
    DateBL = models.DateField(null=True, blank=True)
    BL_File = models.FileField(upload_to='uploads/BL', null=True, blank=True)
    observation = models.TextField(blank=True, null=True)
    isComplet = models.BooleanField(default=False)
    consommable = models.BooleanField(default=False)
    apple = models.BooleanField(default=False)
    fourniseur = models.CharField(max_length=60, null=True, blank=True)
    TV = models.IntegerField(blank=True, null=True)
    TT = models.IntegerField(blank=True, null=True)
    TL = models.IntegerField(blank=True, null=True)

    def save(self, *args, **kwargs):
        try:
            if not self.pk:
                super(Achats, self).save(*args, **kwargs)

            current_time = datetime.now()
            current_time_formatted = datetime.strptime(
                current_time.strftime('%Y-%m-%d'), '%Y-%m-%d').date()
            if self.DateDeCommande and self.DateDA:
                self.TV = (self.DateDA - self.DateDeCommande).days
            elif self.DateDeCommande:
                self.TV = (current_time_formatted - self.DateDeCommande).days
            if self.DateBC and self.DateDA:
                self.TT = (self.DateBC - self.DateDA).days
            elif self.DateDA:
                self.TT = (current_time_formatted - self.DateDA).days

            if self.DateBL and self.DateBC:
                self.TL = (self.DateBL - self.DateBC).days
            elif self.DateBC:
                self.TL = (current_time_formatted - self.DateBC).days

            super(Achats, self).save(*args, **kwargs)
        except Exception as e:
            logger.exception(f'Error in saving Achats instance: {str(e)}')

    def __str__(self):
        return str(self.DateDeCommande)
