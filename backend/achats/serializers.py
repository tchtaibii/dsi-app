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


class AchatFilterSerializer(serializers.Serializer):
    typeDachat = serializers.IntegerField(required=False)
    DA = serializers.CharField(max_length=100, required=False)
    BC = serializers.CharField(max_length=100, required=False)
    BL = serializers.CharField(max_length=100, required=False)
    situation_d_achat = serializers.IntegerField(required=False)
    typeDarticle = serializers.CharField(max_length=100, required=False)
    reste = serializers.BooleanField(required=False)
    isLivre = serializers.BooleanField(required=False)