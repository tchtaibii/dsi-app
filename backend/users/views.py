# views.py
from django.contrib.auth.hashers import check_password
from django.db import transaction
import re
from django.core.mail import send_mail
import string
import random
from django.http import JsonResponse
from .decorators import validate_access_token
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework.throttling import UserRateThrottle
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from .serializers import CustomUserSerializer, LoginSerializer, UpdateUserSerializer, AvatarSerializer, GetUserSerializer
from .permissions import IsSuperuserPermission, IsOwnerOrSuperuser
from .models import CustomUser
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from drf_yasg import openapi
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.http import require_http_methods
from drf_yasg.utils import swagger_auto_schema
import logging

logger = logging.getLogger(__name__)


@swagger_auto_schema(methods=['post'], request_body=CustomUserSerializer)
@permission_classes([IsAuthenticated, IsSuperuserPermission])
@api_view(['POST'])
@throttle_classes([UserRateThrottle])
def user_registration(request):
    try:
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            if not is_valid_email(email):
                return Response("Invalid email format", status=status.HTTP_400_BAD_REQUEST)

            length = 10
            chars = string.ascii_letters + string.digits + string.punctuation
            generated_password = ''.join(random.choice(chars)
                                         for _ in range(length))

            with transaction.atomic():
                user = CustomUser(
                    email=email,
                    first_name=serializer.validated_data['first_name'],
                    last_name=serializer.validated_data['last_name'],
                    is_superuser=serializer.validated_data['is_superuser'],
                    is_reception=serializer.validated_data['is_reception'],
                    is_achat_manager=serializer.validated_data['is_achat_manager'],
                    agent_affectation=serializer.validated_data['agent_affectation']
                )
                user.set_password(generated_password)
                user.save()
                send_mail(
                    'Your Account Details',
                    f'Your Email: {user.email}<br>Your password: {generated_password}<br>Please change your password after login',
                    'tehsusrhist@gmail.com',
                    [user.email],
                    fail_silently=False,
                    html_message=f'Your Email: {user.email}<br>Your password: {generated_password}<br>Please change your password after login',
                )
                refresh = RefreshToken.for_user(user)
                token = {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
                return Response(token, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        if 'user' in locals() and user:
            user.delete()
        return Response("An error occurred on the server.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(pattern, email) is not None


@swagger_auto_schema(methods=['post'], request_body=LoginSerializer)
@permission_classes([AllowAny])  # Allow anyone to access this view (for login)
@throttle_classes([UserRateThrottle])  # Add rate limiting
@require_http_methods(["POST"])
@api_view(['POST'])
def user_login(request):
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            token = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
            return Response(token, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        return Response("An error occurred on the server.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(methods=['patch'], request_body=UpdateUserSerializer)
@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsOwnerOrSuperuser])
@throttle_classes([UserRateThrottle])
def update_login(request):
    try:
        user = request.user
        data = request.data.copy()  # Make a copy of the request data

        # Remove fields with empty values to avoid overwriting existing data
        for key, value in list(data.items()):
            if value == "":
                del data[key]

        serializer = UpdateUserSerializer(user, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        return Response("An error occurred on the server.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# class AvatarUpdateAPIView(APIView):
#     parser_classes = [MultiPartParser]

    # @swagger_auto_schema(
    #     operation_id='Update user avatar',
    #     operation_description='Update user avatar by providing an image file',
    #     manual_parameters=[
    #         openapi.Parameter(
    #             'avatar',
    #             in_=openapi.IN_FORM,
    #             type=openapi.TYPE_FILE,
    #             description='Avatar image file'
    #         )
    #     ],
    #     responses={
    #         status.HTTP_200_OK: openapi.Response(
    #             'Success', schema=openapi.Schema(
    #                 type=openapi.TYPE_OBJECT,
    #                 properties={
    #                     'message': openapi.Schema(
    #                         type=openapi.TYPE_STRING,
    #                         description='Success message'
    #                     )
    #                 }
    #             )
    #         ),
    #         status.HTTP_400_BAD_REQUEST: openapi.Response(
    #             'Bad Request', schema=openapi.Schema(
    #                 type=openapi.TYPE_OBJECT,
    #                 properties={
    #                     'error': openapi.Schema(
    #                         type=openapi.TYPE_STRING,
    #                         description='Error message'
    #                     )
    #                 }
    #             )
    #         )
    #     }
    # )
    # @permission_classes([IsAuthenticated])
    # @throttle_classes([UserRateThrottle])
    # def post(self, request, *args, **kwargs):
    #     try:
    #         user = request.user

    #         # Check if the user is authenticated
    #         if not user.is_authenticated:
    #             return Response("Authentication required. Please log in.", status=status.HTTP_401_UNAUTHORIZED)

    #         # Check if the user has the necessary permissions
    #         # if not request.user.has_perm('your_app.change_user_avatar'):
    #         #     return Response("Access to this resource is forbidden.", status=status.HTTP_403_FORBIDDEN)

    #         serializer = AvatarSerializer(user, data=request.data)
    #         if serializer.is_valid():
    #             serializer.save()
    #             return Response("Updated avatar successfully", status=status.HTTP_200_OK)
    #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    #     except Exception as e:
    #         # Log the exception for debugging
    #         logger.error(str(e))
    #         return Response("An error occurred on the server.", status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def file_upload_view(request):
    if request.method == 'POST' and 'image' in request.FILES:
        user = request.user  # Assuming the user is authenticated
        image_file = request.FILES['image']

        # Update the avatar field of the user
        user.avatar = image_file
        user.save()

        return Response({'message': 'Avatar updated successfully.'})

    return Response({'error': 'No file was uploaded or incorrect request method.'}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@throttle_classes([UserRateThrottle])
def get_profile(request, id):
    try:
        profile = get_object_or_404(CustomUser, id=id)
        serializer = GetUserSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except CustomUser.DoesNotExist:
        return Response("User not found", status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        # Log the exception
        logger.error(f"An error occurred: {str(e)}")
        return Response("An error occurred on the server.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
@throttle_classes([UserRateThrottle])
def get_all_profile(request):
    try:
        users = CustomUser.objects.all()
        serializer = GetUserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_info(request):
    user = request.user
    serializer = GetUserSerializer(user)

    return Response(serializer.data)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Log the user out
        request.auth.logout(request)

        return Response({'detail': 'Successfully logged out.'}, status=status.HTTP_200_OK)


class MyProtectedView(APIView):
    @validate_access_token
    def get(self, request):
        # Your view logic for authenticated users
        response_data = {
            'message': 'Authenticated user can access this endpoint.'}
        return JsonResponse(response_data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_password(request):
    user = request.user
    old_password = request.data.get('oldPass')
    new_password = request.data.get('newPAss')

    if not (old_password and new_password):
        return Response({'error': 'Old password and new password are required.'}, status=400)

    if not check_password(old_password, user.password):
        print('heree')
        return Response({'error': 'Old password is incorrect.'}, status=400)

    password_regex = (
        r'^(?=.*[A-Z])'
        r'(?=.*[a-z])'
        r'(?=.*\d)'
        r'(?=.*[@$!%*?&])'
        r'.{8,}$'
    )

    if not re.match(password_regex, new_password):
        return Response({'error': 'Password does not meet complexity requirements.'}, status=400)

    user.set_password(new_password)
    user.save()

    return Response({'message': 'Password updated successfully.'})


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsSuperuserPermission])
def update_session(request, id):
    try:
        user = CustomUser.objects.get(id=id)
        if user:
            data = request.data
            user.is_achat_manager = data.get('AchaManager', False)
            user.is_reception = data.get('Reception', False)
            user.agent_affectation = data.get('Affectation', False)
            user.save()
            return Response({'message': 'User roles updated successfully'})
        return Response({'error': 'User not found'}, status=404)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    except Exception as e:
        return Response({'error': f'An error occurred: {str(e)}'}, status=500)
