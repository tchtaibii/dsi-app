from rest_framework import serializers
from .models import Achat, Article, Contrat
from rest_framework.response import Response
from rest_framework import status

class ContratSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contrat
        fields = '__all__'

class ArticleSerializer(serializers.ModelSerializer):
    contrat = ContratSerializer()  # Use 'contrat' instead of 'contrat : ContratSerializer'
    
    class Meta:
        model = Article
        fields = '__all__'

class AchatSerializer(serializers.ModelSerializer):
    article = ArticleSerializer()  # Use 'article' instead of 'article = ArticleSerializer()'
    
    class Meta:
        model = Achat
        fields = '__all__'