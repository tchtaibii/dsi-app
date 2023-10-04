from django.urls import path
from . import views


urlpatterns = [
    path('add/', views.add_product, name='add-product'),
    path('<str:pk>/update/', views.update_product, name='update-product'),
    path('<str:email>/user/', views.filtered_logs, name='get-user-logs'),
    path('<str:pk>/delete/', views.delete_product, name='delete-product'),
    path('<str:pk>/', views.get_product, name='get-product'),
    path('get/types/', views.get_types, name='get-types'),
    path('get/etat/', views.get_etat, name='get-etat'),
    path('add/type/', views.add_type, name='add_type'),
    path('add/etat/', views.add_etat, name='add_etat'),
    path('get/logs/', views.get_logs, name='get_logs'),
    path('product', views.filtered_products_list, name='filtered-products-list'),
    path('product', views.filtered_products_list, name='filtered-products-list'),
    
    # Define other app-specific URL patterns here
]