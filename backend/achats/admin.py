from django.contrib import admin
from .models import Contrat
from .models import TypeDArticle
from .models import Article
from .models import TypeDachat
from .models import SituationDachat
from .models import Achat

admin.site.register(Contrat)
admin.site.register(TypeDArticle)
admin.site.register(Article)
admin.site.register(TypeDachat)
admin.site.register(SituationDachat)
admin.site.register(Achat)