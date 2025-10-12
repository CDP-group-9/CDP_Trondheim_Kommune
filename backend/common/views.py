from django.apps import apps
from django.views import generic

from drf_spectacular.utils import OpenApiExample, extend_schema
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Counter, MockResponse
from .serializers import CounterSerializer, MessageSerializer, MockResponseSerializer


class CounterViewSet(viewsets.ViewSet):
    serializer_class = CounterSerializer

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def increment(self, request):
        counter, created = Counter.objects.get_or_create(id=1)
        counter.value += 1
        counter.save()
        return Response({"count": counter.value}, status=status.HTTP_200_OK)


class IndexView(generic.TemplateView):
    template_name = "common/index.html"


class RestViewSet(viewsets.ViewSet):
    serializer_class = MessageSerializer

    @extend_schema(
        summary="Check REST API",
        description="This endpoint checks if the REST API is working.",
        examples=[
            OpenApiExample(
                "Successful Response",
                value={
                    "message": "This message comes from the backend. "
                    "If you're seeing this, the REST API is working!"
                },
                response_only=True,
            )
        ],
        methods=["GET"],
    )
    @action(
        detail=False,
        methods=["get"],
        permission_classes=[AllowAny],
        url_path="rest-check",
    )
    def rest_check(self, request):
        serializer = self.serializer_class(
            data={
                "message": "This message comes from the backend. "
                "If you're seeing this, the REST API is working!"
            }
        )
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MockResponseViewSet(viewsets.ModelViewSet):
    queryset = MockResponse.objects.all()
    serializer_class = MockResponseSerializer

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def fetch_by_keyword(self, request):
        input_text = request.data.get("input", "")
        if "dpia" in input_text.lower():
            mock = MockResponse.objects.filter(response__icontains="dpia").first()
        elif "anonymisere" in input_text.lower():
            mock = MockResponse.objects.filter(response__icontains="anonymisere").first()
        else:
            # print tables in the DB

            models = apps.get_models()
            model_names = [model.__name__ for model in models]
            print("Available models:", model_names)
            return Response({"message": "Don't ask me that."}, status=status.HTTP_200_OK)

        if mock:
            serializer = self.get_serializer(mock)
            return Response(serializer.data)
        return Response({"error": "No mock response found."}, status=status.HTTP_404_NOT_FOUND)
