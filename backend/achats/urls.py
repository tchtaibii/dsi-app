from django.urls import path
from . import views


urlpatterns = [
    path('add/', views.add_commande, name='add_commande'),
    # Define other app-specific URL patterns here
]