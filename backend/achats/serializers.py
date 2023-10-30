from rest_framework import serializers
from .models import Achat, Article, Contrat, Achats


class ContratSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contrat
        fields = '__all__'


class ResteItemSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    designation = serializers.CharField()
    reste = serializers.CharField()


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


class AchatsSerializer(serializers.ModelSerializer):
    achat = AchatSerializer(many=True, read_only=True)

    class Meta:
        model = Achats
        fields = '__all__'


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
    typeDachat = serializers.IntegerField()
    achats = ProgAchatSerializer(many=True)


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
    reste = ResteItemSerializer(many=True)
    is_ = serializers.CharField(required=True)
    fournisseur = serializers.CharField(required=False)


class PostOBSerializer(serializers.Serializer):
    code = serializers.CharField(required=True)
    reste = ResteItemSerializer(many=True)
    is_ = serializers.CharField(required=True)


class FileSerializer(serializers.Serializer):
    file = serializers.CharField()
