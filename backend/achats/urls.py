from django.urls import path
from . import views


urlpatterns = [
    path('add/', views.add_commande, name='add_commande'),
    path('get/commandes/', views.get_commandes, name='get_commandes'),
    path('get/achat/<str:id>', views.get_achat, name='get-achat'),
    path('get/types_achats', views.get_types_achat, name='get-types-achats'),
    path('get/types_article', views.get_types_article, name='get-types-articles'),
    path('get/situations_article', views.get_situation_achat,
         name='get-situation-achats'),
    path('getprogrss/<str:id>', views.get_progress, name='get-progress'),
    path('progress/<str:id>', views.progress, name='post-progress'),
    path('excelExport/', views.ExcelExportView, name='excel-export'),
    path('download_file/<str:fl>', views.download_file, name='download-file'),
    path('situationDash/', views.dashboard_header, name='situation-dashboard'),
    path('pieChart/', views.dashboard_pie, name='Pie-dashboard'),
    
]
