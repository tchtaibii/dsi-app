from rest_framework import serializers
from .models import Products, TypeProduct, ProductAuditLog, EtatProduct

class ProductsSerializer(serializers.ModelSerializer):
    author_email = serializers.CharField(source='author.email', read_only=True)
    class Meta:
        model = Products
        exclude = ('audit_logs',)  # Exclude the 'audit_logs' and 'author' fields during creation

    def create(self, validated_data):
        # Get the user who made the request
        user = self.context['request'].user

        # Add the user as the author when creating the product
        validated_data['author'] = user

        # Create and return the product instance
        product = Products.objects.create(**validated_data)
        return product

class TypeProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeProduct
        fields = '__all__'

class AuditLogsSerializer(serializers.ModelSerializer):
    updated_by_fn = serializers.CharField(source='updated_by.first_name', read_only=True)
    updated_by_ln = serializers.CharField(source='updated_by.last_name', read_only=True)
    product_type = serializers.CharField(source='product.type_product', read_only=True)
    product_name = serializers.CharField(source='product.name_product', read_only=True)

    class Meta:
        model = ProductAuditLog
        fields = '__all__'
    
class EtatProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = EtatProduct
        fields = '__all__'

class UpdateProduct(serializers.ModelSerializer):
    date_d_integration = serializers.DateField(required=False)
    date_d_affectation = serializers.DateField(required=False)
    etat_order = serializers.PrimaryKeyRelatedField(queryset=EtatProduct.objects.all(), required=False)
    email = serializers.EmailField(required=False)
    nom_prenom = serializers.CharField(max_length=100, required=False)
    fonction = serializers.CharField(max_length=100, required=False)
    entite = serializers.CharField(max_length=100, required=False)

    class Meta:
        model = Products
        fields = (
            'date_d_integration',
            'date_d_affectation',
            'etat_order',
            'email',
            'nom_prenom',
            'fonction',
            'entite',
        )

class ProductFilterSerializer(serializers.Serializer):
    start_date_arivage = serializers.DateField(required=False)
    end_date_arivage = serializers.DateField(required=False)
    start_date_integration = serializers.DateField(required=False)
    end_date_integration = serializers.DateField(required=False)
    start_date_affectation = serializers.DateField(required=False)
    end_date_affectation = serializers.DateField(required=False)
    etat_order = serializers.CharField(max_length=100, required=False)
    type_product = serializers.CharField(max_length=100, required=False)


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = '__all__'

class LogsFilterSerializer(serializers.Serializer):
    start_date = serializers.DateField(required=False)
    end_date = serializers.DateField(required=False)
    type_product = serializers.CharField(max_length=100, required=False)


