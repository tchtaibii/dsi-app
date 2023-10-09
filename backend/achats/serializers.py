from rest_framework import serializers
from .models import Achat, Article
from rest_framework.response import Response
from rest_framework import status


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ['code', 'designation', 'type',
                  'fourniseur', 'prix_estimatif']


class AchatSerializer(serializers.ModelSerializer):
    article = ArticleSerializer()  # Serializer for Article data

    class Meta:
        model = Achat
        fields = ['demandeur', 'entité', 'article', 'ligne_bugetaire', 'quantité', 'DateDeCommande', 'typeDachat']

