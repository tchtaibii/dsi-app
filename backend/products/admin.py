from django.contrib import admin

# Register your models here.

from .models import Products
from .models import ProductAuditLog
from .models import TypeProduct
from .models import EtatProduct

admin.site.register(Products)
admin.site.register(ProductAuditLog)
admin.site.register(TypeProduct)
admin.site.register(EtatProduct)