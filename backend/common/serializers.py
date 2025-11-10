from rest_framework import serializers

from .models import MockResponse


class MockResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = MockResponse
        fields = ("id", "response")


class ChatRequestSerializer(serializers.Serializer):
    """Defines the expected input structure for the chat API."""

    prompt = serializers.CharField(
        max_length=2000, required=True, help_text="The user's new message to the model."
    )
    history = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        help_text="The full conversation history as a list of Content dictionaries.",
    )
    context_text = serializers.CharField(
        max_length=5000,
        required=False,
        allow_null=True,
        help_text="Optional context (e.g., RAG snippets) to augment the prompt.",
    )
    system_instructions = serializers.CharField(
        max_length=1000,
        required=False,
        allow_null=True,
        help_text="Optional instructions to guide the model's persona.",
    )
    model_name = serializers.CharField(
        max_length=50,
        required=False,
        default="gemini-2.5-flash",
        help_text="The Gemini model to use for generation.",
    )


class ChatResponseSerializer(serializers.Serializer):
    """Defines the expected output structure from the chat API."""

    response = serializers.CharField(help_text="The model's generated text response.")
    history = serializers.ListField(
        child=serializers.DictField(),
        help_text="The full, updated conversation history (including the latest turn).",
    )


# ruff: noqa
class ChecklistRequestSerializer(serializers.Serializer):
    selectedOption = serializers.CharField()
    contextData = serializers.DictField()
    handlingData = serializers.DictField()
    legalBasisData = serializers.DictField()
    involvedPartiesData = serializers.DictField()
    techData = serializers.DictField()
    riskConcernData = serializers.DictField()


# ruff: noqa: end


class ChecklistResponseSerializer(serializers.Serializer):
    response = serializers.CharField()
