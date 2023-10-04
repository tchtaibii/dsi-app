from rest_framework import serializers
from .models import CustomUser


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'password', 'first_name',
                  'last_name', 'mobile', 'proffession')


class UpdateUserSerializer(serializers.ModelSerializer):

    first_name = serializers.CharField(max_length=100, required=False)
    last_name = serializers.CharField(max_length=100, required=False)

    class Meta:
        model = CustomUser
        fields = ('first_name', 'last_name')

    def update(self, instance, validated_data):
        # Update first name if provided
        instance.first_name = validated_data.get(
            'first_name', instance.first_name)

        # Update last name if provided
        instance.last_name = validated_data.get(
            'last_name', instance.last_name)

        # Save the updated user instance
        instance.save()
        return instance


class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'password')


class AvatarSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(
        max_length=None, allow_empty_file=False, use_url=True)
    class Meta:
        model = CustomUser
        fields = ('avatar',)


class GetUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'avatar', 'first_name',
                  'last_name', 'mobile', 'proffession')