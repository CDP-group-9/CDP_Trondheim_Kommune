from rest_framework import serializers

from .models import Counter, MockResponse


class MessageSerializer(serializers.Serializer):
    message = serializers.CharField()


class CounterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Counter
        fields = ("id", "value")


class MockResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = MockResponse
        fields = ("id", "response")
