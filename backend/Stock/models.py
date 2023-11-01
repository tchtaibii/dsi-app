from django.db import models


class StockEtat(models.Model):
    etat = models.CharField(
        max_length=50, default='Stock', blank=False, null=False)

    def __str__(self):
        return self.etat

class Stock(models.Model):
    NomPrenom = models.CharField(max_length=100, null=True, blank=True)
    designation = models.TextField(null=False, blank=False)
    Fonction = models.CharField(max_length=50, null=True, blank=True)
    type = models.ForeignKey('achats.TypeDArticle', on_delete=models.CASCADE)
    etat = models.ForeignKey('StockEtat', on_delete=models.CASCADE)
    situation = models.CharField(max_length=100, null=True, blank=True)
    DateArrivage = models.DateField(null=False, blank=False)


class inStock(models.Model):
    BC = models.CharField(max_length=30, null=False, blank=False)
    fourniseur = models.CharField(max_length=30, null=False, blank=False)
    entité = models.CharField(max_length=50, null=False, blank=False)
    stock = models.ManyToManyField('Stock')
