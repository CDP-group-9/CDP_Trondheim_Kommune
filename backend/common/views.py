from django.views import generic

from asgiref.sync import async_to_sync
from drf_spectacular.utils import OpenApiExample, extend_schema
from google.genai.types import Content
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Counter, MockResponse
from .serializers import (
    ChatRequestSerializer,
    ChatResponseSerializer,
    CounterSerializer,
    MessageSerializer,
    MockResponseSerializer,
)
from .utils.gemini_client import GEMINI_CHAT_SERVICE


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
        print(f"Received input: {input_text}")

        if "dpia" in input_text.lower():
            mock = MockResponse.objects.filter(response__icontains="dpia").first()
        elif "anonymisere" in input_text.lower():
            mock = MockResponse.objects.filter(response__icontains="anonymisere").first()
        else:
            return Response({"response": "DASQ."}, status=status.HTTP_200_OK)

        if mock:
            serializer = self.get_serializer(mock)
            return Response(serializer.data)
        return Response({"error": "No mock response found."}, status=status.HTTP_404_NOT_FOUND)


# ------------- Gemini chat service ---------------

# --- Helper functions for history serialization ---
# Since Content objects are complex, Django/JSON needs help serializing them.


def history_to_json(history: list[Content]) -> list[dict]:
    """Converts a list of Content objects to a list of serializable dictionaries."""
    result = []
    for content in history:
        if hasattr(content, "to_dict"):
            result.append(content.to_dict())
        elif hasattr(content, "__dict__"):
            # Fallback: convert object attributes to dict
            result.append(vars(content))
        else:
            # Last resort: try to serialize basic attributes
            result.append(
                {
                    "role": getattr(content, "role", "user"),
                    "parts": getattr(content, "parts", [str(content)]),
                }
            )
    return result


def json_to_history(history_json: list[dict]) -> list[Content]:
    """Converts a list of history dictionaries back into Content objects."""
    # We must explicitly convert the dicts back to the google SDK's Content type
    try:
        return [Content(**data) for data in history_json]
    except (TypeError, ValueError, KeyError):
        # Fallback: create Content objects with basic structure
        result = []
        for data in history_json:
            try:
                result.append(Content(**data))
            except (TypeError, ValueError, KeyError):
                # Create a minimal Content object
                result.append(
                    Content(
                        role=data.get("role", "user"),
                        parts=data.get("parts", [data.get("text", "")]),
                    )
                )
        return result


class ChatViewSet(viewsets.ViewSet):
    @extend_schema(
        summary="Gemini Chat Conversation Turn",
        description="Sends a new message and previous history to Gemini, returning the model's response and the updated history.",
        request=ChatRequestSerializer,
        responses={
            status.HTTP_200_OK: ChatResponseSerializer,
            status.HTTP_500_INTERNAL_SERVER_ERROR: {
                "type": "object",
                "properties": {"error": {"type": "string"}},
            },
        },
    )
    @action(
        detail=False,
        methods=["post"],
        permission_classes=[AllowAny],
        url_path="chat",
    )
    def chat_api_view(self, request):
        """
        Handles a single turn of an ongoing chat session.
        """
        try:
            # Use request.data instead of json.loads(request.body) in DRF
            data = request.data
            user_prompt = data.get("prompt", "")

            # Get optional parameters, if they are in the request
            previous_history_json = data.get("history", [])
            system_instructions = data.get("system_instructions", None)
            context_text = data.get("context_text", None)
            model_name = data.get("model_name", "gemini-2.5-flash")

            # Convert the JSON history to SDK Content objects
            previous_history = json_to_history(previous_history_json)

            # chat call
            response_text, updated_history = async_to_sync(
                GEMINI_CHAT_SERVICE.async_send_chat_message
            )(
                prompt=user_prompt,
                current_history=previous_history,
                system_instruction=system_instructions,
                model_name=model_name,
                context_text=context_text,
            )

            # Convert the updated history back to JSON format for the frontend
            updated_history_json = history_to_json(updated_history)

            return Response(
                {"response": response_text, "history": updated_history_json},
                status=status.HTTP_200_OK,
            )

        except (ValueError, TypeError, KeyError, AttributeError) as e:
            return Response(
                {"error": f"AI Error: {e!s}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
