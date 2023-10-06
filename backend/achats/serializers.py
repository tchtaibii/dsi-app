from rest_framework import serializers
from .models import Achat, Article
from rest_framework.response import Response
from rest_framework import status

# Serializer for the Article model
class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ('code', 'designation', 'type', 'fourniseur', 'prix_estimatif')

# Serializer for creating an Achat instance
class AchatCreateSerializer(serializers.Serializer):
    demandeur = serializers.CharField()
    entité = serializers.CharField()
    article = ArticleSerializer(required=False)  # Make it optional
    ligne_bugetaire = serializers.CharField()
    quantité = serializers.IntegerField()
    DateDeCommande = serializers.DateField()
    typeDachat = serializers.IntegerField()
    situation_d_achat = serializers.IntegerField(default=2)  # Set default value
