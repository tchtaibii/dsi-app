from django.urls import path
from . import views


urlpatterns = [
    path('add/', views.add_commande, name='add_commande'),
    path('get/commandes/', views.get_commandes, name='get_commandes'),
    path('get/achat/<str:id>', views.get_achat, name='get-achat'),
    path('get/types_achats', views.get_types_achat, name='get-types-achats'),
    path('get/types_article', views.get_types_article, name='get-types-articles'),
    path('get/situations_article', views.get_situation_achat, name='get-situation-achats'),
    path('getprogrss/<str:id>', views.get_progress, name='get-progress'),
    
]