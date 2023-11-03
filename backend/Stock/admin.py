from django.contrib import admin
from .models import Stock, StockEtat, inStock

# Register your models here.
admin.site.register(StockEtat)
admin.site.register(Stock)
admin.site.register(inStock)