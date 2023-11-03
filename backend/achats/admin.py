from django.contrib import admin
from .models import Contrat
from .models import TypeDArticle
from .models import Article
from .models import TypeDachat
from .models import SituationDachat
from .models import Achat
from .models import Achats

admin.site.register(Achats)
admin.site.register(Achat)
admin.site.register(Article)
admin.site.register(Contrat)
admin.site.register(TypeDArticle)
admin.site.register(TypeDachat)
admin.site.register(SituationDachat)
