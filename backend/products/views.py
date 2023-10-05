from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from .serializers import ProductsSerializer, TypeProductSerializer, UpdateProduct, AuditLogsSerializer, EtatProductSerializer, ProductFilterSerializer, ProductSerializer, LogsFilterSerializer
from rest_framework.response import Response
from rest_framework import status
from .models import TypeProduct, EtatProduct, Products, ProductAuditLog
from .permissions import IsSuperuserPermission, IsSuperuserOrAuthorPermission
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from rest_framework.throttling import UserRateThrottle
import logging
from datetime import datetime, timedelta, date
from collections import Counter


logger = logging.getLogger(__name__)


@swagger_auto_schema(methods=['post'], request_body=ProductsSerializer)
@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Apply the custom permission
@throttle_classes([UserRateThrottle])
def add_product(request):
    try:
        serializer = ProductsSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            service_tag = serializer.validated_data.get('service_tag')
            if Products.objects.filter(service_tag=service_tag).exists():
                return Response({'error': 'A product with this service_tag already exists.'}, status=status.HTTP_400_BAD_REQUEST)

            # Additional validation and processing logic can be added here

            # Save the Product instance
            product = serializer.save()

            # Get the user who created the product
            user = request.user

            # Log the creation of the product
            ProductAuditLog.objects.create(
                product=product,
                new_etat=product.etat_order,  # Set new_etat to the initial etat_order
                updated_by=user
            )

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        return Response("An error occurred on the server.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(methods=['patch'], request_body=UpdateProduct)
@api_view(['PATCH'])
# Apply the custom permission
@permission_classes([IsAuthenticated, IsSuperuserOrAuthorPermission])
@throttle_classes([UserRateThrottle])
def update_product(request, pk):
    try:
        product = Products.objects.get(pk=pk)
    except Products.DoesNotExist:
        return Response({"detail": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    # Get the existing etat_order value for logging
    old_etat_order = product.etat_order

    serializer = ProductsSerializer(product, data=request.data, partial=True)
    if serializer.is_valid():
        # Update the product
        serializer.save()

        # Get the user who made the update
        user = request.user

        # Log the update
        new_etat_order = product.etat_order  # Get the updated etat_order
        if old_etat_order != new_etat_order:
            ProductAuditLog.objects.create(
                product=product,
                new_etat=new_etat_order,  # Set new_etat to the updated etat_order
                updated_by=user
            )

        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsSuperuserPermission])
@throttle_classes([UserRateThrottle])
def delete_product(request, pk):
    try:
        product = Products.objects.get(pk=pk)
    except Products.DoesNotExist:
        return Response({"detail": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    product.delete()  # Delete the product

    return Response({"detail": "Product deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@throttle_classes([UserRateThrottle])
def get_product(request, pk):
    product = get_object_or_404(Products, pk=pk)
    serializer = ProductsSerializer(product)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@throttle_classes([UserRateThrottle])
def get_etat(request):
    # Get all TypeProduct objects
    Etat_products = EtatProduct.objects.all()
    # Serialize the TypeProduct objects into JSON using TypeProductSerializer
    serializer = EtatProductSerializer(Etat_products, many=True)
    # Return the serialized data as a JSON response
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@throttle_classes([UserRateThrottle])
def get_types(request):
    # Get all TypeProduct objects
    type_products = TypeProduct.objects.all()
    # Serialize the TypeProduct objects into JSON using TypeProductSerializer
    serializer = TypeProductSerializer(type_products, many=True)
    # Return the serialized data as a JSON response
    return Response(serializer.data)


@swagger_auto_schema(methods=['post'], request_body=TypeProductSerializer)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([UserRateThrottle])  # Add rate limiting
def add_type(request):
    try:
        serializer = TypeProductSerializer(data=request.data)
        if serializer.is_valid():
            # Additional validation and processing logic can be added here

            # Save the TypeProduct instance
            serializer.save()

            # Return the newly created TypeProduct
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # Validation error
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        return Response("An error occurred on the server.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(methods=['post'], request_body=TypeProductSerializer)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([UserRateThrottle])  # Add rate limiting
def add_etat(request):
    try:
        serializer = EtatProductSerializer(data=request.data)
        if serializer.is_valid():
            # Additional validation and processing logic can be added here

            # Save the TypeProduct instance
            serializer.save()

            # Return the newly created TypeProduct
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # Validation error
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        return Response("An error occurred on the server.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(method='get', query_serializer=LogsFilterSerializer)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@throttle_classes([UserRateThrottle])
def get_logs(request):
    try:
        queryset = ProductAuditLog.objects.all()
        serializer_class = AuditLogsSerializer

        # Get the query parameters
        type_product_param = request.query_params.get('type_product', None)
        start_date_param = request.query_params.get('start_date', None)
        end_date_param = request.query_params.get('end_date', None)

        # Define function to parse date parameters
        def parse_date(date_str):
            return datetime.strptime(date_str, '%Y-%m-%d')

        # Apply filters based on query parameters
        if type_product_param:
            queryset = queryset.filter(
                product__type_product__name__icontains=type_product_param)

        if start_date_param and end_date_param:
            start_date = parse_date(start_date_param)
            end_date = parse_date(end_date_param) + timedelta(days=1)
            queryset = queryset.filter(
                updated_at__range=(start_date, end_date))
        elif start_date_param:
            start_date = parse_date(start_date_param)
            end_date = start_date + timedelta(days=1)
            queryset = queryset.filter(
                updated_at__range=(start_date, end_date))
        elif end_date_param:
            end_date = parse_date(end_date_param) + timedelta(days=1)
            queryset = queryset.filter(updated_at__lte=end_date)

        # Serialize the filtered queryset
        serializer = serializer_class(queryset, many=True)

        # Create a list to store unique product IDs
        unique_product_ids = []

        # Create a list to store result data without duplicate products
        unique_result_data = []

        # Calculate counts and filter duplicate products
        for item in serializer.data:
            product_id = item['product']

            # Skip this item if its product ID is already in the list
            if product_id in unique_product_ids:
                continue

            # Add the product ID to the list of unique product IDs
            unique_product_ids.append(product_id)

            # Add the item to the list of unique result data
            unique_result_data.append(item)

        # Calculate counts
        count_affecte = Counter(
            item['new_etat'] for item in unique_result_data).get('affecté', 0)
        count_attente = Counter(
            item['new_etat'] for item in unique_result_data).get('attente', 0)
        product_name_counts = Counter(
            item['product_name'] for item in unique_result_data)

        # Find the most common product_name
        most_common_product_name = product_name_counts.most_common(1)
        if most_common_product_name:
            most_common_product_name = most_common_product_name[0][0]
        else:
            most_common_product_name = None

        # Create a response dictionary with the counts
        response_data = {
            "count_affecte": count_affecte,
            "count_attente": count_attente,
            "most_common_product_name": most_common_product_name,
            "result": serializer.data
        }

        return Response(response_data)

    except Exception as e:
        # Handle exceptions
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(method='get', query_serializer=ProductFilterSerializer)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@throttle_classes([UserRateThrottle])
def filtered_products_list(request):
    try:
        queryset = Products.objects.all()

        # Get the query parameters for date fields
        start_date_arivage = request.query_params.get(
            'start_date_arivage', None)
        end_date_arivage = request.query_params.get('end_date_arivage', None)

        start_date_integration = request.query_params.get(
            'start_date_integration', None)
        end_date_integration = request.query_params.get(
            'end_date_integration', None)

        start_date_affectation = request.query_params.get(
            'start_date_affectation', None)
        end_date_affectation = request.query_params.get(
            'end_date_affectation', None)

        # Get the query parameters for character fields
        etat_order_param = request.query_params.get('etat_order', None)
        type_product_param = request.query_params.get('type_product', None)

        # Define functions to parse date parameters and handle open ranges
        def parse_date(date_str):
            return datetime.strptime(date_str, '%Y-%m-%d').date()

        def apply_date_range_filter(queryset, start_date_param, end_date_param, field_name):
            if start_date_param and end_date_param:
                start_date = parse_date(start_date_param)
                end_date = parse_date(end_date_param)
                queryset = queryset.filter(
                    **{f'{field_name}__range': (start_date, end_date)})
            elif start_date_param:
                start_date = parse_date(start_date_param)
                queryset = queryset.filter(
                    **{f'{field_name}__gte': start_date})
            elif end_date_param:
                end_date = parse_date(end_date_param)
                queryset = queryset.filter(**{f'{field_name}__lte': end_date})
            return queryset

        # Apply filters based on query parameters
        queryset = apply_date_range_filter(
            queryset, start_date_arivage, end_date_arivage, 'date_d_arivage')
        queryset = apply_date_range_filter(
            queryset, start_date_integration, end_date_integration, 'date_d_integration')
        queryset = apply_date_range_filter(
            queryset, start_date_affectation, end_date_affectation, 'date_d_affectation')

        if etat_order_param:
            queryset = queryset.filter(
                etat_order__name__icontains=etat_order_param)

        if type_product_param:
            queryset = queryset.filter(
                type_product__name__icontains=type_product_param)

        # Serialize the filtered queryset
        serializer = ProductSerializer(queryset, many=True)

        return Response(serializer.data)

    except Exception as e:
        # Handle exceptions
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from users.models import CustomUser


# @swagger_auto_schema(method='get', query_serializer=ProductFilterSerializer)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@throttle_classes([UserRateThrottle])
def filtered_logs(request, email):
    try:
        if not email:
            return Response({'error': 'Author email is required as a query parameter.'}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve the CustomUser object based on the provided email
        user = CustomUser.objects.filter(email=email).first()

        if not user:
            return Response({'error': 'User with the provided email does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        logs = ProductAuditLog.objects.filter(updated_by=user)

        # Serialize the logs
        serializer = AuditLogsSerializer(logs, many=True)

        # Get today's date
        today = date.today()
        
        # Calculate the start and end dates for the current week
        current_week_start = today - timedelta(days=today.weekday())
        current_week_end = current_week_start + timedelta(days=6)

        # Calculate the start and end dates for the current month
        current_month_start = today.replace(day=1)
        current_month_end = (today.replace(day=28) + timedelta(days=4)).replace(day=1) - timedelta(days=1)

        # Count logs for today, this week, and this month
        logs_today = logs.filter(updated_at__date=today).count()
        logs_this_week = logs.filter(updated_at__date__range=(current_week_start, current_week_end)).count()
        logs_this_month = logs.filter(updated_at__date__range=(current_month_start, current_month_end)).count()

        response_data = {
            'logs': serializer.data,
            'logs_today': logs_today,
            'logs_this_week': logs_this_week,
            'logs_this_month': logs_this_month,
        }

        return Response(response_data)

    except Exception as e:
        # Handle exceptions
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
