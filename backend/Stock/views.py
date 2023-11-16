from django.db.models import Q
from rest_framework import status
from django.utils import timezone
from datetime import datetime, timedelta
import logging
from drf_yasg import openapi
from rest_framework import serializers
from drf_yasg.utils import swagger_auto_schema
from .models import Stocks, Stock
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view
import pandas as pd
from django.shortcuts import render
from .permissions import IsReceptionPermission
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import IsAuthenticated
from .models import Stock, inStock, StockEtat, Stocks, StockSituation
from rest_framework.throttling import UserRateThrottle
from django.http import JsonResponse
from django.http import HttpResponse
from rest_framework.response import Response
from django.db.models import Sum
from achats.models import TypeDArticle


@api_view(['GET'])
# @permission_classes([IsAuthenticated, IsReceptionPermission])
@throttle_classes([UserRateThrottle])
def all_inStock(request):
    try:
        in_stocks = inStock.objects.all()
        data = []
        for in_stock in in_stocks:
            stock_data = []
            for stock in in_stock.stocks.all():
                stock_data.append({
                    'designation': stock.designation,
                    'type': stock.type.type,
                    'quantité': stock.quantité,
                    'affecté': stock.affecté,
                    'id': stock.id
                })
            in_stock_data = {
                'id': in_stock.id,
                'BC': in_stock.BC,
                'entité': in_stock.entité,
                'fourniseur': in_stock.fourniseur,
                'stocks': stock_data,
            }
            data.append(in_stock_data)
    except Exception as e:
        print(e)
    return JsonResponse(data, safe=False)


@api_view(['GET'])
# @permission_classes([IsAuthenticated, IsReceptionPermission])
@throttle_classes([UserRateThrottle])
def types_in_stock(request):
    try:
        types = TypeDArticle.objects.all()
        data = []
        for type in types:
            quantity = Stocks.objects.filter(type=type).aggregate(
                total=Sum('quantité')).get('total', 0)
            affecté = Stocks.objects.filter(type=type).aggregate(
                total=Sum('affecté')).get('total', 0)
            data.append({
                'type': type.type,
                'quantity': quantity,
                'affecté': affecté
            })
    except Exception as e:
        print(e)
        return JsonResponse({'error': 'An error occurred while processing the request.'}, status=500)
    return JsonResponse(data, safe=False)


@api_view(['GET'])
# @permission_classes([IsAuthenticated, IsReceptionPermission])
@throttle_classes([UserRateThrottle])
def stocks_by_type(request, type_name):
    try:
        stocks = Stocks.objects.filter(type__type=type_name).values_list('designation').distinct().annotate(
            total_quantité=Sum('quantité'), total_affected=Sum('affecté')).order_by()

        data = []
        for stock in stocks:
            data.append({
                'designation': stock[0],
                'quantité': stock[1],
                'affecté': stock[2]
            })
    except Exception as e:
        print(e)
        return JsonResponse({'error': 'An error occurred while processing the request.'}, status=500)

    return JsonResponse(data, safe=False)


@api_view(['GET'])
# @permission_classes([IsAuthenticated, IsReceptionPermission])
@throttle_classes([UserRateThrottle])
def stock_bc(request, id):
    try:
        stocks = inStock.objects.filter(id=id).first()
        if not stocks:
            return JsonResponse({'error': 'Stocks not found'}, status=404)
        data = {
            'BC': stocks.BC,
            'fournisseur': stocks.fourniseur,
            'entité': stocks.entité,
            'stocks': list(stocks.stocks.values())
        }
    except Exception as e:
        return JsonResponse({'error': 'An error occurred while processing the request.'}, status=500)

    return JsonResponse(data, safe=False)


@api_view(['GET'])
def count_stocks_with_null_service_tag(request, id):
    try:
        stocks_instance = Stocks.objects.get(id=id)
        mark = stocks_instance.mark if len(stocks_instance.mark) > 0 else None
        modele = stocks_instance.modele if len(
            stocks_instance.modele) > 0 else None
        related_stocks = stocks_instance.stocks.all()
        count_stocks_with_null_service_tag = related_stocks.filter(
            serviceTag__isnull=True
        ).count() + related_stocks.filter(
            serviceTag=''
        ).count()
        return Response({'count': count_stocks_with_null_service_tag, 'mark': mark, 'modele': modele})
    except Stocks.DoesNotExist:
        return JsonResponse({'error': 'Stocks not found'}, status=404)
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An error occurred while processing the request.'}, status=500)


class StockUpdate(serializers.Serializer):
    mark = serializers.CharField(max_length=100, required=False)
    modele = serializers.CharField(max_length=100, required=False)
    # excel_file = serializers.CharField(required=False)


@swagger_auto_schema(method='post', request_body=StockUpdate)
@api_view(['POST'])
def update_stock_and_stocks(request, id):
    try:
        mark = request.data.get('mark')
        modele = request.data.get('modele')
        excel_file = request.data.get('excel_file') if request.data.get(
            'excel_file') != 'null' else None

        stocks_instance = Stocks.objects.get(id=id)
        if mark and mark != 'null':
            stocks_instance.mark = mark
        if modele and modele != 'null':
            stocks_instance.modele = modele
        stocks_instance.save()
        if excel_file:
            df = pd.read_excel(excel_file)
            if not df.empty:
                service_tags = df.iloc[0:, 0].tolist()
                service_tags = [str(tag) for tag in service_tags if tag]
                service_tags = service_tags[:stocks_instance.stocks.count()]
                for stock, service_tag in zip(stocks_instance.stocks.all(), service_tags):
                    if not stock.serviceTag:
                        stock.serviceTag = service_tag
                        stock.save()

        return Response({'success': 'Stocks filled successfully'})
    except Stocks.DoesNotExist:
        return JsonResponse({'error': 'Stocks not found'}, status=404)
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An error occurred while processing the request.'}, status=500)


logger = logging.getLogger(__name__)


@api_view(['GET'])
# @permission_classes([IsAuthenticated, IsManagerAchatPermission])
def get_stocks_details(request, id):
    try:
        stocks_instance = Stocks.objects.get(id=id)
        type_art = stocks_instance.type
        in_stock_instance = stocks_instance.related_instock.first()
        serialized_data = {
            'id': stocks_instance.id,
            'mark': stocks_instance.mark,
            'modele': stocks_instance.modele,
            'type': str(type_art),
            'stocks': [
                {
                    'stock_id': stock.id,
                    'NomPrenom': stock.NomPrenom,
                    'Fonction': stock.Fonction,
                    'etat': stock.etat.etat,
                    'situation': stock.situation_id,
                    'serviceTag': stock.serviceTag,
                    'entité': in_stock_instance.entité if in_stock_instance else None
                }
                for stock in stocks_instance.stocks.all()
            ]
        }
        return Response(serialized_data)
    except Exception as e:
        logger.exception(f'Error in retrieving achats data: {e}')
        return Response({'error': 'Stocks not found'}, status=404)


@api_view(['GET'])
# @permission_classes([IsAuthenticated, IsManagerAchatPermission])
def get_product(request, id):
    try:
        stock = Stock.objects.get(id=id)
        related_stocks = stock.related_stocks.first()
        if related_stocks:
            in_stock_instances = related_stocks.related_instock.first()
        affected_by_first_name = stock.affected_by.first_name if stock.affected_by else None
        affected_by_last_name = stock.affected_by.last_name if stock.affected_by else None
        serialized_data = {
            'id': stock.id,
            'NomPrenom': stock.NomPrenom,
            'Fonction': stock.Fonction,
            'etat': str(stock.etat),
            'situation': stock.situation_id,
            'DateArrivage': stock.DateArrivage,
            'serviceTag': stock.serviceTag,
            'affected_by': affected_by_first_name + affected_by_last_name,
            'DateDaffectation': stock.DateDaffectation,
            # 'designation': related_stocks.designation,
            'mark': related_stocks.mark,
            'modele': related_stocks.modele,
            'type': str(related_stocks.type),
            'BC': in_stock_instances.BC,
            'fourniseur': in_stock_instances.fourniseur,
            'entité': in_stock_instances.entité,
        }
        return JsonResponse(serialized_data)
    except Stock.DoesNotExist:
        return JsonResponse({'error': 'Stock not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)


@api_view(['GET'])
# @permission_classes([IsAuthenticated, IsManagerAchatPermission])
@throttle_classes([UserRateThrottle])
def get_situation_stock(request):
    types = StockSituation.objects.all()
    types = types.values('id', 'situation')
    types_list = list(types)
    return JsonResponse(types_list, safe=False)


@api_view(['POST'])
@throttle_classes([UserRateThrottle])
def affected_produit(request, id):
    try:
        stock = Stock.objects.get(id=id)
        if stock:
            data = request.data
            nom = data.get('nom')
            entite = data.get('entité')
            fonction = data.get('fonction')
            situation = data.get('situation')
            if not (nom and isinstance(nom, str) and entite and isinstance(entite, str) and fonction and isinstance(fonction, str) and situation and isinstance(situation, int)):
                return Response("Invalid Data", status=status.HTTP_400_BAD_REQUEST)

            requester_name = request.user

            stock.NomPrenom = nom
            stock.Fonction = fonction
            stock.situation_id = situation
            stock.etat_id = 2
            stock.affected_by = requester_name
            stock.DateDaffectation = timezone.now()
            stock.save()

            related_stock = stock.related_stocks.first()
            if related_stock:
                related_stock.affecté += 1
                related_stock.save()

            in_stock_instance = related_stock.related_instock.first()
            if in_stock_instance:
                in_stock_instance.entité = entite
                in_stock_instance.save()

            return Response("Stock updated successfully", status=status.HTTP_200_OK)

    except Stock.DoesNotExist:
        return Response({'error': 'Stock not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.exception(f'Error updating stock: {e}')
        return Response({'error': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FilterStock(serializers.Serializer):
    query = serializers.CharField(max_length=100, required=True)


@swagger_auto_schema(method='get', query_serializery=FilterStock)
@api_view(['GET'])
def filter_stocks(request, string=None):
    try:
        search_query = string
        if (search_query == None):
            stocks = Stock.objects.all()
        else:
            stocks = Stock.objects.filter(
                Q(NomPrenom__icontains=search_query) |
                Q(Fonction__icontains=search_query) |
                Q(serviceTag__icontains=search_query) |
                Q(affected_by__icontains=search_query) |
                Q(related_stocks__designation__icontains=search_query) |
                Q(related_stocks__mark__icontains=search_query) |
                Q(related_stocks__modele__icontains=search_query) |
                Q(related_stocks__type__type__icontains=search_query) |
                Q(related_stocks__related_instock__BC__icontains=search_query) |
                Q(related_stocks__related_instock__fourniseur__icontains=search_query) |
                Q(related_stocks__related_instock__entité__icontains=search_query)
            ).distinct()

        serialized_data = []
        for stock in stocks:
            related_stocks = stock.related_stocks.first()
            in_stock_instances = related_stocks.related_instock.first() if related_stocks else None
            affected_by_first_name = stock.affected_by.first_name if stock.affected_by else None
            affected_by_last_name = stock.affected_by.last_name if stock.affected_by else None
            data = {
                'id': stock.id,
                'NomPrenom': stock.NomPrenom,
                'Fonction': stock.Fonction,
                'etat': str(stock.etat),
                'situation': stock.situation_id,
                'DateArrivage': stock.DateArrivage,
                'DateDaffectation': stock.DateDaffectation,
                'serviceTag': stock.serviceTag,
                'affected_by': affected_by_first_name + affected_by_last_name,
                'mark': related_stocks.mark if related_stocks else None,
                'modele': related_stocks.modele if related_stocks else None,
                'type': str(related_stocks.type) if related_stocks else None,
                'BC': in_stock_instances.BC if in_stock_instances else None,
                'fourniseur': in_stock_instances.fourniseur if in_stock_instances else None,
                'entité': in_stock_instances.entité if in_stock_instances else None,
            }
            serialized_data.append(data)

        return JsonResponse(serialized_data, safe=False)
    except Exception as e:
        return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)
