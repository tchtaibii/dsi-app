from django.db import models


class StockEtat(models.Model):
    etat = models.CharField(
        max_length=50, default='Stock', blank=False, null=False)

    def __str__(self):
        return self.etat

class Stock(models.Model):
    NomPrenom = models.CharField(max_length=100, null=True, blank=True)
    Fonction = models.CharField(max_length=50, null=True, blank=True)
    etat = models.ForeignKey('StockEtat', on_delete=models.CASCADE)
    situation = models.CharField(max_length=100, null=True, blank=True)
    DateArrivage = models.DateField(null=True, blank=True)
    serviceTag = models.CharField(max_length=50, null=True, blank=True)



class Stocks(models.Model):
    designation = models.TextField(null=False, blank=False)
    type = models.ForeignKey('achats.TypeDArticle', on_delete=models.CASCADE)
    quantité=models.IntegerField(null=False, blank=False, default=0)
    affecté=models.IntegerField(null=False, blank=False, default=0)
    stocks = models.ManyToManyField('Stock')


class inStock(models.Model):
    BC = models.CharField(max_length=30, null=False, blank=False)
    fourniseur = models.CharField(max_length=30, null=True, blank=True)
    entité = models.CharField(max_length=50, null=False, blank=False)
    stocks = models.ManyToManyField('Stocks')