from rest_framework import serializers
from .models import Achat, Article, Contrat
from rest_framework.response import Response
from rest_framework import status


class ContratSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contrat
        fields = '__all__'


class ArticleSerializer(serializers.ModelSerializer):
    contrat = ContratSerializer()

    class Meta:
        model = Article
        fields = '__all__'


class AchatSerializer(serializers.ModelSerializer):
    article = ArticleSerializer()

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
    isComplet = serializers.BooleanField(required=False)


class ProgressSerializer(serializers.Serializer):
    DA = serializers.CharField()
    BC = serializers.CharField()
    BL = serializers.CharField()
    isComplet = serializers.BooleanField()
    Designation = serializers.CharField()
    demandeur = serializers.CharField()

class PostDaSerializer(serializers.Serializer):
    DA = serializers.IntegerField(required=True)
    DateDA = serializers.DateTimeField(required=True)

class PostBCSerializer(serializers.Serializer):
    BC = serializers.IntegerField(required=True)
    DateBC = serializers.DateTimeField(required=True)
    FileBC = serializers.FileField(required=True)

class PostBLSerializer(serializers.Serializer):
    BL = serializers.IntegerField(required=True)
    DateBL = serializers.DateTimeField(required=True)
    FileBL = serializers.FileField(required=True)