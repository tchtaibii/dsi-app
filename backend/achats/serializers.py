from rest_framework import serializers
from .models import Achat, Article

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ['code', 'designation', 'contrat', 'type', 'fourniseur', 'prix_estimatif']

class AchatSerializer(serializers.ModelSerializer):
    article_data = ArticleSerializer()  # Serializer for Article data

    class Meta:
        model = Achat
        fields = ['demandeur', 'entité', 'article_data', 'ligne_bugetaire', 'quantité', 'DateDeCommande', 'typeDachat']

    def create(self, validated_data):
        # Extract the Article data from the validated_data
        article_data = validated_data.pop('article_data')
        
        # Create the Article instance
        article, created = Article.objects.get_or_create(**article_data)
        
        # Create the Achat instance with the Article
        achat = Achat.objects.create(article=article, **validated_data)
        return achat

        
