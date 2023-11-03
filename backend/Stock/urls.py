from django.urls import path
from . import views

urlpatterns = [
    path('all_inStock/', views.all_inStock, name='get-stock'),
    path('types_in_stock/', views.types_in_stock, name='get-stock-types'),
    path('stocks_by_type/<str:type_name>', views.stocks_by_type, name='get-stock-by-types'),


]
