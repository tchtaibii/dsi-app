# decorators.py

from functools import wraps
from django.http import JsonResponse
from rest_framework import status
from rest_framework_simplejwt.tokens import TokenError
from rest_framework_simplejwt.authentication import JWTAuthentication

def validate_access_token(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        try:
            # Get the access token from the request headers
            access_token = JWTAuthentication().get_validated_token(request)
            # You can access token claims, e.g., user ID: access_token['user_id']

            # Your custom token validation logic can go here
            # For example, check if the user is active or has certain permissions

            # If the token is valid, proceed with the view
            return view_func(request, *args, **kwargs)
        except TokenError as e:
            # Handle token validation errors, e.g., token expired or invalid
            response_data = {'detail': str(e)}
            return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)

    return _wrapped_view
