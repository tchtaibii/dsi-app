from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from .permissions import IsManagerAchatPermission
from drf_yasg.utils import swagger_auto_schema
from rest_framework.throttling import UserRateThrottle
from .serializers import AchatSerializer
from rest_framework.response import Response
from rest_framework import status
from .models import Achat, Article
import random
import string

# Create your views here.


@swagger_auto_schema(methods=['post'], request_body=AchatSerializer)
@api_view(['POST'])
# Apply the custom permission
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def add_commande(request):
    try:
        serializer = AchatSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            typedachat = serializer.validated_data.get('typeDachat')

            if typedachat == 1:  # Contrat Cadre
                code = serializer.validated_data.get(
                    'article_data', {}).get('code')
                if code:
                    try:
                        article = Article.objects.get(code=code)
                        # Set the retrieved article as the article foreign key
                        serializer.validated_data['article'] = article
                    except Article.DoesNotExist:
                        return Response({'detail': 'Article with code not found'}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({'detail': 'Code is required for Contrat Cadre'}, status=status.HTTP_400_BAD_REQUEST)
            elif typedachat == 2 or typedachat == 3:  # Achat Direct
                # Check if fourniseur exists in request data
                fourniseur = serializer.validated_data.get('article_data', {}).get('fourniseur')
                
                # Generate a random code for the Article starting with 'DSI'
                random_suffix = ''.join(random.choices(string.ascii_letters + string.digits, k=7))
                random_code = 'DSI' + random_suffix
                
                # Set the fourniseur in Article if it exists
                if fourniseur:
                    serializer.validated_data['article_data']['fourniseur'] = fourniseur
                
                # Set the generated code in Article
                serializer.validated_data['article_data']['code'] = random_code
                
                # Set prix_estimatif from request data if it exists
                prix_estimatif = serializer.validated_data.get('article_data', {}).get('prix_estimatif')
                if prix_estimatif is not None:
                    serializer.validated_data['article_data']['prix_estimatif'] = prix_estimatif
                
                # Set the type from request data if it exists
                type_darticle = serializer.validated_data.get('article_data', {}).get('type')
                if type_darticle:
                    serializer.validated_data['article_data']['type'] = type_darticle
                # Example: logic_achat_offre(serializer.validated_data)
            elif typedachat == 4:  # Achat en ligne
                # Apply logic for Achat en ligne
                # Example: logic_achat_en_ligne(serializer.validated_data)
            else:
                return Response({'detail': 'Invalid typeDachat value'}, status=status.HTTP_400_BAD_REQUEST)
            
            achat = serializer.save()

            # Return a success response or perform any additional actions
            return Response({'detail': 'Commande added successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
