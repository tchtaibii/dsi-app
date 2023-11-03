from django.shortcuts import render
from .permissions import IsReceptionPermission
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import IsAuthenticated
from .models import Stock, inStock, StockEtat, Stocks
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
