from django.urls import path
from . import views

urlpatterns = [
    path('all_inStock/', views.all_inStock, name='get-stock'),
    path('types_in_stock/', views.types_in_stock, name='get-stock-types'),
    path('stocks_by_type/<str:type_name>',
         views.stocks_by_type, name='get-stock-by-types'),
    path('stock_bc/<str:id>', views.stock_bc, name='stock_bc'),
    path('service_tags/<str:id>', views.count_stocks_with_null_service_tag,
         name='stock_servicetag_need'),
    path('stock_and_stocks/<str:id>', views.update_stock_and_stocks,
         name='stock_servicetag_need'),
    path('get_stocks_details/<str:id>',
         views.get_stocks_details, name='get_stocks_details'),
    path('get_product/<str:id>', views.get_product, name='get_product'),
    path('user_stock_affectations/<str:id>',
         views.user_stock_affectations, name='user_stock_affectations'),
    path('affected_produit/<str:id>',
         views.affected_produit, name='affected_produit'),
    path('get_situation_stock/', views.get_situation_stock,
         name='get_situation_stock'),
    path('filter_stocks/', views.filter_stocks, name='filter_stocks'),
    path('filter_stocks/<str:string>', views.filter_stocks, name='filter_stocks'),
    path('dashboard_mark_modele/', views.dashboard_mark_modele,
         name='dashboard_mark_modele'),
    path('get_recently_affected_stocks/', views.get_recently_affected_stocks,
         name='get_recently_affected_stocks'),

]
