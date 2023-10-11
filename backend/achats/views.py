from .models import Achat
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Achat, TypeDachat, TypeDArticle, Article, SituationDachat
from .serializers import AchatSerializer, AchatFilterSerializer
from .permissions import IsManagerAchatPermission
from drf_yasg.utils import swagger_auto_schema
from rest_framework.throttling import UserRateThrottle
from datetime import datetime
from django.utils import timezone
from django.http import JsonResponse
import logging
from django.shortcuts import get_object_or_404


logger = logging.getLogger(__name__)


@swagger_auto_schema(methods=['post'], request_body=AchatSerializer)
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def add_commande(request):
    try:
        data = request.data
        demandeur = data.get('demandeur')
        entité = data.get('entité')
        ligne_bugetaire = data.get('ligne_bugetaire')
        quantité = data.get('quantité')
        if (isinstance(quantité, str)):
            quantité = int(quantité)
        DateDeCommande = data.get('DateDeCommande')
        date_obj = datetime.strptime(DateDeCommande, "%Y-%m-%d")
        Type_d_achat = data.get('typeDachat')
        article_ = data.get('article')
        print(data)
        if not ((demandeur is not None and isinstance(demandeur, str))
                and (entité is not None and isinstance(entité, str))
                and (ligne_bugetaire is not None and isinstance(ligne_bugetaire, str))
                and (quantité is not None and isinstance(quantité, int))
                and (DateDeCommande is not None and date_obj.time() == timezone.datetime.min.time())
                and (Type_d_achat is not None and isinstance(Type_d_achat, int))
                and article_ is not None):
            return Response("1 Error Data", status=status.HTTP_400_BAD_REQUEST)
        if Type_d_achat == 1:
            code = article_.get('code')
            if code is not None and isinstance(code, str):
                code = code.strip()
                try:
                    article = Article.objects.filter(code=code).first()
                except Article.DoesNotExist:
                    return Response({'message': 'Article not found.'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response("2 Error Data", status=status.HTTP_400_BAD_REQUEST)
        else:
            now = datetime.now()
            # Format the current time as a string
            timestamp = now.strftime("%Y%m%d%H%M%S")
            code = 'DSI' + timestamp
            designation = article_.get('designation')
            type_article = article_.get('type')
            fourniseur = article_.get('fourniseur')
            prix_estimatif = None
            if (designation is not None and isinstance(designation, str)) and (type_article is not None and isinstance(type_article, str)) \
                    and (fourniseur is not None and isinstance(fourniseur, str)):
                typearticle, created = TypeDArticle.objects.get_or_create(
                    type=type_article)
                if article_.get('prix_estimatif') is not None and isinstance(article_.get('prix_estimatif'), int):
                    prix_estimatif = article_.get('prix_estimatif')
                try:
                    article = Article(
                        code=code,
                        designation=designation,
                        type=typearticle,
                        fourniseur=fourniseur,
                        prix_estimatif=prix_estimatif
                    )
                    article.save()
                except Exception as e:
                    print(e)
            else:
                return Response("3 Error Data", status=status.HTTP_400_BAD_REQUEST)
        situation = SituationDachat.objects.get(id=2)
        Type_d_achat_instance = TypeDachat.objects.get(id=Type_d_achat)
        try:
            achat = Achat(
                article=article,
                demandeur=demandeur,
                entité=entité,
                ligne_bugetaire=ligne_bugetaire,
                quantité=quantité,
                DateDeCommande=date_obj,
                typeDachat=Type_d_achat_instance,  # Assign the instance, not the integer
                situation_d_achat=situation
            )
        except Exception as e:
            print(f"Error: {str(e)}")
        try:
            achat.save()
        except Exception as e:
            return Response({'**message': 'Article not found.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response("ok", status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'message': 'Article not found.'}, status=status.HTTP_400_BAD_REQUEST)
    # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(method='get', query_serializer=AchatFilterSerializer)
@api_view(['GET'])
# @permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def get_commandes(request):
    try:
        achats = Achat.objects.all()
        params = request.query_params
        if 'typeDachat' in params:
            achats = achats.filter(typeDachat=params['typeDachat'])
        if 'DA' in params:
            achats = achats.filter(DA=params['DA'])
        if 'BC' in params:
            achats = achats.filter(BC=params['BC'])
        if 'BL' in params:
            achats = achats.filter(BL=params['BL'])
        if 'situation_d_achat' in params:
            achats = achats.filter(
                situation_d_achat=params['situation_d_achat'])
        if 'typeDarticle' in params:
            achats = achats.filter(article__type=params['typeDarticle'])
        if 'reste' in params and params['reste'].lower() == 'true':
            achats = achats.filter(reste__gt=0)
        if 'isLivre' in params and params['isLivre'].lower() == 'true':
            achats = achats.filter(
                ~Q(situation_d_achat__situation=params['Livré']))
        achats = achats.select_related('article').values(
            'demandeur', 'entité', 'DateDeCommande', 'DA', 'situation_d_achat', 'id', 'article__designation')
        achats_list = list(achats)
        print(achats_list)
    except Exception as e:
        print(e)
    return JsonResponse(achats_list, safe=False)


@api_view(['GET'])
# @permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def get_achat(request, id):
    achat = get_object_or_404(Achat, id=id)
    serializer = AchatSerializer(achat)
    return Response(serializer.data)


@api_view(['GET'])
# @permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def get_types_article(request):
    types = TypeDArticle.objects.all()
    types = types.values('type')
    types_list = list(types)
    return JsonResponse(types_list, safe=False)


@api_view(['GET'])
# @permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def get_types_achat(request):
    types = TypeDachat.objects.all()
    types = types.values('id', 'type')
    types_list = list(types)
    return JsonResponse(types_list, safe=False)


@api_view(['GET'])
# @permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def get_situation_achat(request):
    types = SituationDachat.objects.all()
    types = types.values('id', 'situation')
    types_list = list(types)
    return JsonResponse(types_list, safe=False)
