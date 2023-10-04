from django.db import models
from django.conf import settings

class TypeProduct(models.Model):
    name = models.CharField(max_length=100, primary_key=True, unique=True, db_index=True);

    def __str__(self):
        return self.name

class EtatProduct(models.Model):
    name = models.CharField(max_length=100, primary_key=True, unique=True, db_index=True);

    def __str__(self):
        return self.name

class ProductAuditLog(models.Model):
    id = models.AutoField(primary_key=True)
    product = models.ForeignKey('Products', on_delete=models.CASCADE)
    new_etat = models.CharField(max_length=255)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, to_field='email')
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product} - {self.new_etat} - {self.updated_at}"

class Products(models.Model):
    date_d_arivage = models.DateField()
    type_product = models.ForeignKey('TypeProduct', on_delete=models.PROTECT)
    etat_order = models.ForeignKey('EtatProduct', on_delete=models.PROTECT)
    nom_prenom = models.CharField(max_length=100)
    fonction = models.CharField(max_length=100)
    entite = models.CharField(max_length=100)
    name_product = models.CharField(max_length=100)
    service_tag = models.CharField(max_length=30, primary_key=True, unique=True) #imei
    date_d_integration = models.DateField(null=True, blank=True)
    date_d_affectation = models.DateField(null=True, blank=True)
    iccid = models.CharField(max_length=23, null=True, blank=True)
    nd = models.CharField(max_length=50, null=True, blank=True)
    email = models.CharField(max_length=255, null=True, blank=True)

    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    audit_logs = models.ManyToManyField('ProductAuditLog', blank=True, related_name='products_audit_logs')  # Updated related_name

    def __str__(self):
        return self.service_tag

    def log_update(self, field_name, old_value, new_value, user):
        log_entry = ProductAuditLog.objects.create(
            field_name=field_name,
            old_value=old_value,
            new_value=new_value,
            updated_by=user
        )
        self.audit_logs.add(log_entry)