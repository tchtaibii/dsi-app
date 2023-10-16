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
    reste = serializers.IntegerField()


class FileSerializer(serializers.Serializer):
    file = serializers.CharField()


class ProgressPostSerializer(serializers.Serializer):
    code = serializers.CharField(required=False)
    date = serializers.DateField(required=False)
    is_ = serializers.CharField(required=True)
    reste = serializers.CharField(required=False)
    obs = serializers.CharField(required=False)


class PostDaSerializer(serializers.Serializer):
    code = serializers.CharField(required=True)
    date = serializers.DateTimeField(required=True)


class PostBCSerializer(serializers.Serializer):
    code = serializers.CharField(required=True)
    date = serializers.DateTimeField(required=True)
    is_ = serializers.CharField(required=True)


class PostBLSerializer(serializers.Serializer):
    code = serializers.CharField(required=True)
    date = serializers.DateTimeField(required=True)
    reste = serializers.IntegerField(required=True)
    is_ = serializers.CharField(required=True)

class PostOBSerializer(serializers.Serializer):
    code = serializers.CharField(required=True)
    reste = serializers.IntegerField(required=True)
    is_ = serializers.CharField(required=True)
