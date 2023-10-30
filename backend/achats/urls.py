from django.urls import path
from . import views


urlpatterns = [
    path('add/', views.add_commande, name='add_commande'),
    path('get/commandes/', views.get_commandes, name='get_commandes'),
    path('get/PV/<str:id>', views.generate_word_file, name='get-PV'),
    path('get/achat/<str:id>', views.get_achat, name='get-achats'),
    path('get/types_achats', views.get_types_achat, name='get-types-achats'),
    path('get/situations_article', views.get_situation_achat,
         name='get-situation-achats'),
    path('getprogrss/<str:id>', views.get_progress, name='get-progress'),
    path('progress/<str:id>', views.progress, name='post-progress'),
    path('excelExport/', views.ExcelExportView, name='excel-export'),
    path('download_file/<str:fl>', views.download_file, name='download-file'),
    path('situationDash/', views.dashboard_header, name='situation-dashboard'),
    path('pieChart/', views.dashboard_pie, name='Pie-dashboard'),
    path('lineChart/', views.dashboard_line, name='Line-dashboard'),
    path('linesChart/', views.dashboard_lines, name='Line-dashboard'),
    path('deleteAchats/<str:id>', views.delete_achats, name='Delete-achats'),
    path('colChart/', views.types_with_total_quantity, name='TypeDarticle-dash'),
    path('search/', views.search_commands, name='search'),
    path('addArticles/', views.add_articles, name='add-article'),
    path('addAchats/', views.add_achats_file, name='add-achats'),
    path('downloadAchats/', views.download_achats_file, name='downlaod-achats'),
    path('downloadArticle/', views.download_article_file, name='downlaod-article'),
]
