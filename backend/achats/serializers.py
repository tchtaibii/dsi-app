from rest_framework import serializers
from .models import Achat, Article, Contrat, Achats
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


class AchatTSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achats
        # fields = '__all__'
        exclude = ('achat',)


class AchatsSerializer(serializers.ModelSerializer):
    achat = AchatSerializer(many=True, read_only=True)

    class Meta:
        model = Achats
        fields = '__all__'


class AchatsGSerializer(serializers.Serializer):
    demandeur = serializers.CharField()
    entite = serializers.CharField()
    ligne_bugetaire = serializers.CharField()
    DateDeCommande = serializers.DateField()
    typeDachat = serializers.IntegerField()
    achats = serializers.ListField(child=serializers.DictField())


# class AchatsSerializer(serializers.ModelSerializer):
#     achat = AchatSerializer()

#     class Meta:
#         model = Achats
#         fields = '__all__'


class AchatFilterSerializer(serializers.Serializer):
    typeDachat = serializers.IntegerField(required=False)
    DA = serializers.CharField(max_length=100, required=False)
    BC = serializers.CharField(max_length=100, required=False)
    BL = serializers.CharField(max_length=100, required=False)
    situation_d_achat = serializers.IntegerField(required=False)
    typeDarticle = serializers.CharField(max_length=100, required=False)
    BCR = serializers.BooleanField(required=False)
    isComplet = serializers.BooleanField(required=False)


class ProgAchatSerializer(serializers.ModelSerializer):
    designation = serializers.CharField(source='article.designation')

    class Meta:
        model = Achat
        fields = ['designation', 'reste', 'id']


class ProgressSerializer(serializers.Serializer):
    DA = serializers.CharField()
    BC = serializers.CharField()
    BL = serializers.CharField()
    isComplet = serializers.BooleanField()
    demandeur = serializers.CharField()
    achats = ProgAchatSerializer(many=True)


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


class ResteItemSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    designation = serializers.CharField()
    reste = serializers.CharField()


class PostBLSerializer(serializers.Serializer):
    code = serializers.CharField(required=True)
    date = serializers.DateTimeField(required=True)
    reste = ResteItemSerializer(many=True)
    is_ = serializers.CharField(required=True)
    fournisseur = serializers.CharField(required=True)

class PostOBSerializer(serializers.Serializer):
    code = serializers.CharField(required=True)
    reste = ResteItemSerializer(many=True)
    is_ = serializers.CharField(required=True)
