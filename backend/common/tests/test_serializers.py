from django.test import TestCase

from common.models import MockResponse
from common.serializers import (
    ChatRequestSerializer,
    ChatResponseSerializer,
    ChecklistRequestSerializer,
    ChecklistResponseSerializer,
    MockResponseSerializer,
)


class MockResponseSerializerTest(TestCase):
    def test_serialization(self):
        """Test serializing a MockResponse object"""
        mock_response = MockResponse.objects.create(response="Test response")
        serializer = MockResponseSerializer(mock_response)

        self.assertEqual(serializer.data["id"], mock_response.id)
        self.assertEqual(serializer.data["response"], "Test response")

    def test_deserialization_valid_data(self):
        """Test deserializing valid data to create a MockResponse"""
        data = {"response": "New test response"}
        serializer = MockResponseSerializer(data=data)

        self.assertTrue(serializer.is_valid())
        mock_response = serializer.save()
        self.assertEqual(mock_response.response, "New test response")

    def test_deserialization_invalid_data(self):
        """Test deserialization fails with missing required field"""
        data = {}
        serializer = MockResponseSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("response", serializer.errors)


class ChatRequestSerializerTest(TestCase):
    def test_valid_data_minimal(self):
        """Test validation with minimal required data"""
        data = {"prompt": "Hello, how are you?"}
        serializer = ChatRequestSerializer(data=data)

        self.assertTrue(serializer.is_valid())

    def test_valid_data_with_history(self):
        """Test validation with history"""
        data = {
            "prompt": "Follow-up question",
            "history": [
                {"type": "user", "message": "First message"},
                {"type": "bot", "message": "First response"},
            ],
        }
        serializer = ChatRequestSerializer(data=data)

        self.assertTrue(serializer.is_valid())
        self.assertEqual(len(serializer.validated_data["history"]), 2)

    def test_valid_data_with_context(self):
        """Test validation with context text"""
        data = {"prompt": "Question", "context_text": "Some context information"}
        serializer = ChatRequestSerializer(data=data)

        self.assertTrue(serializer.is_valid())

    def test_valid_data_with_system_instructions(self):
        """Test validation with system instructions"""
        data = {"prompt": "Question", "system_instructions": "You are a helpful assistant"}
        serializer = ChatRequestSerializer(data=data)

        self.assertTrue(serializer.is_valid())

    def test_valid_data_with_custom_model(self):
        """Test validation with custom model name"""
        data = {"prompt": "Question", "model_name": "gemini-pro"}
        serializer = ChatRequestSerializer(data=data)

        self.assertTrue(serializer.is_valid())

    def test_default_model_name(self):
        """Test that default model name is set"""
        data = {"prompt": "Question"}
        serializer = ChatRequestSerializer(data=data)

        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data["model_name"], "gemini-2.5-flash")

    def test_missing_prompt(self):
        """Test validation fails without prompt"""
        data = {}
        serializer = ChatRequestSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("prompt", serializer.errors)

    def test_prompt_too_long(self):
        """Test validation fails with overly long prompt"""
        data = {"prompt": "x" * 2001}
        serializer = ChatRequestSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("prompt", serializer.errors)

    def test_context_text_too_long(self):
        """Test validation fails with overly long context"""
        data = {"prompt": "Question", "context_text": "x" * 5001}
        serializer = ChatRequestSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("context_text", serializer.errors)

    def test_system_instructions_too_long(self):
        """Test validation fails with overly long system instructions"""
        data = {"prompt": "Question", "system_instructions": "x" * 1001}
        serializer = ChatRequestSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("system_instructions", serializer.errors)


class ChatResponseSerializerTest(TestCase):
    def test_serialization(self):
        """Test serializing chat response data"""
        data = {
            "response": "AI generated response",
            "history": [
                {"type": "user", "message": "Question"},
                {"type": "bot", "message": "AI generated response"},
            ],
        }
        serializer = ChatResponseSerializer(data)

        self.assertEqual(serializer.data["response"], "AI generated response")
        self.assertEqual(len(serializer.data["history"]), 2)


class ChecklistRequestSerializerTest(TestCase):
    def test_valid_data(self):
        """Test validation with complete checklist data"""
        data = {
            "selectedOption": "innsamle",
            "contextData": {
                "projectSummary": "Test project",
                "department": "IT",
                "status": "planning",
                "purpose": "Testing",
            },
            "handlingData": {
                "purpose": "Data collection",
                "selectedDataTypes": ["navn", "epost"],
                "personCount": "100-500",
                "retentionTime": "5",
                "collectionMethods": ["skjema"],
                "recipient": "None",
                "recipientType": "internal",
                "sharingLegalBasis": "consent",
                "shareFrequency": "monthly",
                "selectedDataSources": ["bruker"],
            },
            "legalBasisData": {
                "legalBasis": "consent",
                "handlesSensitiveData": "no",
                "selectedSensitiveDataReason": [],
                "statutoryTasks": "none",
            },
            "involvedPartiesData": {
                "registeredGroups": ["ansatte"],
                "usesExternalProcessors": "no",
                "externalProcessors": "",
                "employeeAccess": "5-10",
                "sharesWithOthers": "no",
                "sharedWith": "",
            },
            "techData": {
                "storage": "cloud",
                "security": ["encryption", "access-control"],
                "integrations": "no",
                "integrationDetails": "",
                "automated": "no",
                "automatedDescription": "",
            },
            "riskConcernData": {
                "privacyRisk": "low",
                "unauthAccess": "low",
                "dataLoss": "low",
                "reidentification": "low",
                "employeeConcern": "no",
                "writtenConcern": "",
                "regulatoryConcern": "no",
            },
        }
        serializer = ChecklistRequestSerializer(data=data)

        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data["selectedOption"], "innsamle")

    def test_missing_required_field(self):
        """Test validation fails with missing field"""
        data = {
            "selectedOption": "innsamle",
            "contextData": {},
        }
        serializer = ChecklistRequestSerializer(data=data)

        self.assertFalse(serializer.is_valid())


class ChecklistResponseSerializerTest(TestCase):
    def test_serialization(self):
        """Test serializing checklist response"""
        data = {"response": "Formatted checklist string"}
        serializer = ChecklistResponseSerializer(data)

        self.assertEqual(serializer.data["response"], "Formatted checklist string")
