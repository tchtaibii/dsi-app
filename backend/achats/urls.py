from django.urls import path
from . import views


urlpatterns = [
    path('add/', views.add_commande, name='add_commande'),
    path('get/commandes/', views.get_commandes, name='get_commandes'),
    path('get/achat/<str:id>', views.get_achat, name='get-achat'),
]