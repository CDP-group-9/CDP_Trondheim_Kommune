from rest_framework import serializers

from .models import Counter


class MessageSerializer(serializers.Serializer):
    message = serializers.CharField()


class CounterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Counter
        fields = ("id", "value")
