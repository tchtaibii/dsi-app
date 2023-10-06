from random import randint
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers
from .models import Achat, Article
from .serializers import AchatCreateSerializer, ArticleSerializer
from .permissions import IsManagerAchatPermission
from drf_yasg.utils import swagger_auto_schema
from rest_framework.throttling import UserRateThrottle
from drf_yasg import openapi


@swagger_auto_schema(methods=['post'], request_body=AchatCreateSerializer)
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def add_commande(request):
    serializer = AchatCreateSerializer(data=request.data)
    if serializer.is_valid():
        article_data = serializer.validated_data.pop('article')
        type_dachat = serializer.validated_data.get('typeDachat')
        # Case 1: typeDachat == 1
        if type_dachat == 1:
            code = serializer.validated_data.get('article', {}).get('code')
            try:
                article = Article.objects.get(code=code)
                serializer.validated_data['article'] = article  # Set the article instance
                serializer.validated_data['type'] = article.type  # Set type from the article
            except Article.DoesNotExist:
                return Response({'message': 'Article not found.'}, status=status.HTTP_400_BAD_REQUEST)

        # Case 2 and 3: typeDachat == 2 or typeDachat == 3
        # elif type_dachat in [2, 3]:
        #     code = article_data.get('code', f'dsi{randint(10000, 99999)}')
        #     designation = article_data.get('designation')
        #     article_type = article_data.get('type')
        #     fournisseur = article_data.get('fournisseur')
        #     prix_estimatif = article_data.get('prix_estimatif')

        #     try:
        #         article = Article.objects.get(code=code)
        #     except Article.DoesNotExist:
        #         article = Article(
        #             code=code,
        #             designation=designation,
        #             type=article_type,
        #             fournisseur=fournisseur,
        #             prix_estimatif=prix_estimatif
        #         )
        #         article.save()

        # # Case 4: typeDachat == 4
        # elif type_dachat == 4:
        #     code = article_data.get('code', f'dsi{randint(10000, 99999)}')
        #     try:
        #         article = Article.objects.get(code=code)
        #     except Article.DoesNotExist:
        #         article = Article(**article_data)
        #         article.save()

        # Create Achat instance with the validated data and the Article instance
        achat = Achat(article=article, **serializer.validated_data)
        achat.save()

        return Response(serializer.validated_data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
