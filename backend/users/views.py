# views.py
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

from drf_yasg.utils import swagger_auto_schema

import logging  # Import the logging module

# Define the logger
logger = logging.getLogger(__name__)


@swagger_auto_schema(methods=['post'], request_body=CustomUserSerializer)
@api_view(['POST'])
@permission_classes([IsSuperuserPermission])
@throttle_classes([UserRateThrottle]) 
def user_registration(request):
    try:
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            # Extract the password from the request data
            password = request.data.get('password')

            # Create a new user instance
            user = CustomUser(email=serializer.validated_data['email'],
                              first_name=serializer.validated_data['first_name'],
                              last_name=serializer.validated_data['last_name'],
                              mobile=serializer.validated_data['mobile'],
                              profession=serializer.validated_data['profession'])

            # Set and hash the password using set_password
            user.set_password(password)

            # Save the user object
            user.save()

            # Now the password is hashed and stored securely

            refresh = RefreshToken.for_user(user)
            token = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
            return Response(token, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        return Response("An error occurred on the server.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(methods=['post'], request_body=LoginSerializer)
@api_view(['POST'])
@permission_classes([AllowAny])  # Allow anyone to access this view (for login)
@throttle_classes([UserRateThrottle])  # Add rate limiting
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


class AvatarUpdateAPIView(APIView):
    parser_classes = [MultiPartParser]
    @swagger_auto_schema(
        operation_id='Update user avatar',
        operation_description='Update user avatar by providing an image file',
        manual_parameters=[
            openapi.Parameter(
                'avatar',
                in_=openapi.IN_FORM,
                type=openapi.TYPE_FILE,
                description='Avatar image file'
            )
        ],
        responses={
            status.HTTP_200_OK: openapi.Response(
                'Success', schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'message': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            description='Success message'
                        )
                    }
                )
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                'Bad Request', schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            description='Error message'
                        )
                    }
                )
            )
        }
    )
    @permission_classes([IsOwnerOrSuperuser])
    @throttle_classes([UserRateThrottle]) 
    def post(self, request, *args, **kwargs):
        try:
            user = request.user

            # Check if the user is authenticated
            if not user.is_authenticated:
                return Response("Authentication required. Please log in.", status=status.HTTP_401_UNAUTHORIZED)

            # Check if the user has the necessary permissions
            if not request.user.has_perm('your_app.change_user_avatar'):
                return Response("Access to this resource is forbidden.", status=status.HTTP_403_FORBIDDEN)

            serializer = AvatarSerializer(user, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response("Updated avatar successfully", status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Log the exception for debugging
            logger.error(str(e))
            return Response("An error occurred on the server.", status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@throttle_classes([UserRateThrottle]) 
def get_profile(request, email):
    try:
        profile = get_object_or_404(CustomUser, email=email)
        serializer = GetUserSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except CustomUser.DoesNotExist:
        return Response("User not found", status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        # Log the exception
        logger.error(f"An error occurred: {str(e)}")
        return Response("An error occurred on the server.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
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
    user = request.user  # The authenticated user making the request
    serializer = GetUserSerializer(user)  # Assuming you have a UserSerializer defined

    return Response(serializer.data)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Log the user out
        request.auth.logout(request)

        return Response({'detail': 'Successfully logged out.'}, status=status.HTTP_200_OK)