from django.conf import settings
from django.utils import timezone
from django.db import models
from users.models import CustomUser


class StockEtat(models.Model):
    etat = models.CharField(
        max_length=50, default='Stock', blank=False, null=False)

    def __str__(self):
        return self.etat


class StockSituation(models.Model):
    situation = models.CharField(
        max_length=50, default=None, blank=True, null=True)

    def __str__(self):
        return self.situation


class Stock(models.Model):
    NomPrenom = models.CharField(max_length=100, null=True, blank=True)
    Fonction = models.CharField(max_length=50, null=True, blank=True)
    etat = models.ForeignKey('StockEtat', on_delete=models.CASCADE)
    situation = models.ForeignKey('StockSituation', on_delete=models.CASCADE, null=True)
    DateArrivage = models.DateField(null=True, blank=True)
    serviceTag = models.CharField(max_length=50, null=True, blank=True)
    affected_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    DateDaffectation = models.DateTimeField(null=True, blank=True)


class Stocks(models.Model):
    designation = models.TextField(null=False, blank=False)
    mark = models.TextField(null=False, blank=False, default='')
    modele = models.TextField(null=False, blank=False, default='')
    type = models.ForeignKey('achats.TypeDArticle', on_delete=models.CASCADE)
    quantité = models.IntegerField(null=False, blank=False, default=0)
    affecté = models.IntegerField(null=False, blank=False, default=0)
    stocks = models.ManyToManyField('Stock', related_name='related_stocks')


class inStock(models.Model):
    BC = models.CharField(max_length=30, null=False, blank=False)
    fourniseur = models.CharField(max_length=30, null=True, blank=True)
    entité = models.CharField(max_length=50, null=False, blank=False)
    stocks = models.ManyToManyField('Stocks', related_name='related_instock')
