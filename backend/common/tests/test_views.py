from unittest.mock import MagicMock, patch

from django.test import TestCase
from django.urls import reverse

from google.genai.types import Content
from rest_framework import status
from rest_framework.test import APIClient

from common.models import MockResponse
from common.views import history_to_json, json_to_history


class MockResponseViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.dpia_mock = MockResponse.objects.create(
            response="This is a DPIA response about data protection impact assessment."
        )
        self.anonymisere_mock = MockResponse.objects.create(
            response="This is about how to anonymisere personal data."
        )

    def test_list_mock_responses(self):
        """Test listing all mock responses"""
        url = reverse("test-response-list")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 2)

    def test_create_mock_response(self):
        """Test creating a new mock response"""
        url = reverse("test-response-list")
        data = {"response": "New test response"}

        initial_count = MockResponse.objects.count()
        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(MockResponse.objects.count(), initial_count + 1)

    def test_fetch_by_keyword_dpia(self):
        """Test fetching mock response with 'dpia' keyword"""
        url = reverse("test-response-fetch-by-keyword")
        data = {"input": "Tell me about DPIA"}

        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("dpia", response.data["response"].lower())

    def test_fetch_by_keyword_anonymisere(self):
        """Test fetching mock response with 'anonymisere' keyword"""
        url = reverse("test-response-fetch-by-keyword")
        data = {"input": "How to anonymisere data"}

        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("anonymisere", response.data["response"].lower())

    def test_fetch_by_keyword_no_match(self):
        """Test fetching mock response when no keyword matches"""
        url = reverse("test-response-fetch-by-keyword")
        data = {"input": "Some random query"}

        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["response"], "DASQ.")

    def test_fetch_dpia_not_found(self):
        """Test fetching DPIA response when none exists"""
        MockResponse.objects.filter(response__icontains="dpia").delete()
        url = reverse("test-response-fetch-by-keyword")
        data = {"input": "Tell me about DPIA"}

        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("error", response.data)

    def test_fetch_anonymisere_not_found(self):
        """Test fetching anonymisere response when none exists"""
        MockResponse.objects.filter(response__icontains="anonymisere").delete()
        url = reverse("test-response-fetch-by-keyword")
        data = {"input": "How to anonymisere data"}

        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("error", response.data)

    def test_fetch_case_insensitive(self):
        """Test that keyword matching is case insensitive"""
        url = reverse("test-response-fetch-by-keyword")
        data = {"input": "What is DpIa?"}

        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("dpia", response.data["response"].lower())

    def test_fetch_empty_input(self):
        """Test fetching mock response with empty input"""
        url = reverse("test-response-fetch-by-keyword")
        data = {"input": ""}

        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_mock_response(self):
        """Test retrieving a specific mock response"""
        url = reverse("test-response-detail", args=[self.dpia_mock.id])

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.dpia_mock.id)

    def test_update_mock_response(self):
        """Test updating a mock response"""
        url = reverse("test-response-detail", args=[self.dpia_mock.id])
        data = {"response": "Updated DPIA response"}

        response = self.client.put(url, data=data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.dpia_mock.refresh_from_db()
        self.assertEqual(self.dpia_mock.response, "Updated DPIA response")

    def test_delete_mock_response(self):
        """Test deleting a mock response"""
        url = reverse("test-response-detail", args=[self.dpia_mock.id])

        initial_count = MockResponse.objects.count()
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(MockResponse.objects.count(), initial_count - 1)


class HistorySerializationTest(TestCase):
    def test_history_to_json_with_content_objects(self):
        """Test converting Content objects to JSON"""
        content1 = Content(role="user", parts=[{"text": "Hello"}])
        content2 = Content(role="model", parts=[{"text": "Hi there"}])
        history = [content1, content2]

        result = history_to_json(history)

        self.assertIsInstance(result, list)
        self.assertEqual(len(result), 2)
        self.assertIsInstance(result[0], dict)
        self.assertIsInstance(result[1], dict)

    def test_history_to_json_with_dict_like_objects(self):
        """Test converting dict-like objects to JSON using __dict__"""
        mock_content = MagicMock()
        mock_content.role = "user"
        mock_content.parts = ["Test"]
        del mock_content.to_dict

        result = history_to_json([mock_content])

        self.assertIsInstance(result, list)
        self.assertEqual(len(result), 1)
        self.assertIsInstance(result[0], dict)

    def test_history_to_json_with_fallback(self):
        """Test history_to_json with objects that need fallback serialization"""
        result = history_to_json(["simple_string"])

        self.assertIsInstance(result, list)
        self.assertEqual(len(result), 1)

    def test_json_to_history_with_valid_data(self):
        """Test converting JSON back to Content objects"""
        history_json = [
            {"role": "user", "parts": [{"text": "Hello"}]},
            {"role": "model", "parts": [{"text": "Hi"}]},
        ]

        result = json_to_history(history_json)

        self.assertIsInstance(result, list)
        self.assertEqual(len(result), 2)
        self.assertIsInstance(result[0], Content)
        self.assertIsInstance(result[1], Content)

    def test_json_to_history_graceful_fallback(self):
        """Test json_to_history creates Content objects from minimal data"""
        history_json = [
            {"role": "user", "parts": [{"text": "valid"}]},
        ]

        result = json_to_history(history_json)

        self.assertIsInstance(result, list)
        self.assertEqual(len(result), 1)


class ChatViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("chat-chat-api-view")

    @patch("common.views.GEMINI_CHAT_SERVICE")
    def test_chat_success(self, mock_service):
        """Test successful chat API call"""
        mock_service.send_chat_message_sync.return_value = (
            "This is a response",
            [
                Content(role="user", parts=[{"text": "Hello"}]),
                Content(role="model", parts=[{"text": "This is a response"}]),
            ],
        )
        data = {"prompt": "Hello", "history": []}

        response = self.client.post(self.url, data=data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("response", response.data)
        self.assertIn("history", response.data)
        self.assertEqual(response.data["response"], "This is a response")

    @patch("common.views.GEMINI_CHAT_SERVICE")
    def test_chat_with_history(self, mock_service):
        """Test chat API call with conversation history"""
        mock_service.send_chat_message_sync.return_value = (
            "Follow-up response",
            [
                Content(role="user", parts=[{"text": "First message"}]),
                Content(role="model", parts=[{"text": "First response"}]),
                Content(role="user", parts=[{"text": "Second message"}]),
                Content(role="model", parts=[{"text": "Follow-up response"}]),
            ],
        )
        data = {
            "prompt": "Second message",
            "history": [
                {"role": "user", "parts": [{"text": "First message"}]},
                {"role": "model", "parts": [{"text": "First response"}]},
            ],
        }

        response = self.client.post(self.url, data=data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("response", response.data)
        self.assertIn("history", response.data)
        mock_service.send_chat_message_sync.assert_called_once()

    @patch("common.views.GEMINI_CHAT_SERVICE")
    def test_chat_with_context(self, mock_service):
        """Test chat API call with context text"""
        mock_service.send_chat_message_sync.return_value = (
            "Response with context",
            [
                Content(role="user", parts=[{"text": "Question"}]),
                Content(role="model", parts=[{"text": "Response with context"}]),
            ],
        )
        data = {
            "prompt": "Question",
            "history": [],
            "context_text": "Some relevant context",
        }

        response = self.client.post(self.url, data=data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        call_kwargs = mock_service.send_chat_message_sync.call_args[1]
        self.assertEqual(call_kwargs["context_text"], "Some relevant context")

    @patch("common.views.GEMINI_CHAT_SERVICE")
    def test_chat_with_system_instructions(self, mock_service):
        """Test chat API call with system instructions"""
        mock_service.send_chat_message_sync.return_value = (
            "Response",
            [
                Content(role="user", parts=[{"text": "Question"}]),
                Content(role="model", parts=[{"text": "Response"}]),
            ],
        )
        data = {
            "prompt": "Question",
            "history": [],
            "system_instructions": "You are a helpful assistant",
        }

        response = self.client.post(self.url, data=data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        call_kwargs = mock_service.send_chat_message_sync.call_args[1]
        self.assertEqual(call_kwargs["system_instruction"], "You are a helpful assistant")

    @patch("common.views.GEMINI_CHAT_SERVICE")
    def test_chat_with_custom_model(self, mock_service):
        """Test chat API call with custom model name"""
        mock_service.send_chat_message_sync.return_value = (
            "Response",
            [
                Content(role="user", parts=[{"text": "Question"}]),
                Content(role="model", parts=[{"text": "Response"}]),
            ],
        )
        data = {
            "prompt": "Question",
            "history": [],
            "model_name": "gemini-pro",
        }

        response = self.client.post(self.url, data=data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        call_kwargs = mock_service.send_chat_message_sync.call_args[1]
        self.assertEqual(call_kwargs["model_name"], "gemini-pro")

    @patch("common.views.GEMINI_CHAT_SERVICE")
    def test_chat_default_model(self, mock_service):
        """Test chat API uses default model when not specified"""
        mock_service.send_chat_message_sync.return_value = (
            "Response",
            [
                Content(role="user", parts=[{"text": "Question"}]),
                Content(role="model", parts=[{"text": "Response"}]),
            ],
        )
        data = {"prompt": "Question", "history": []}

        response = self.client.post(self.url, data=data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        call_kwargs = mock_service.send_chat_message_sync.call_args[1]
        self.assertEqual(call_kwargs["model_name"], "gemini-2.5-flash")

    @patch("common.views.GEMINI_CHAT_SERVICE")
    def test_chat_error_value_error(self, mock_service):
        """Test chat API handles ValueError with 500 response"""
        mock_service.send_chat_message_sync.side_effect = ValueError("Invalid input")
        data = {"prompt": "Question", "history": []}

        response = self.client.post(self.url, data=data, format="json")

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn("error", response.data)

    @patch("common.views.GEMINI_CHAT_SERVICE")
    def test_chat_error_type_error(self, mock_service):
        """Test chat API handles TypeError with 500 response"""
        mock_service.send_chat_message_sync.side_effect = TypeError("Type mismatch")
        data = {"prompt": "Question", "history": []}

        response = self.client.post(self.url, data=data, format="json")

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn("error", response.data)

    @patch("common.views.GEMINI_CHAT_SERVICE")
    def test_chat_error_key_error(self, mock_service):
        """Test chat API handles KeyError with 500 response"""
        mock_service.send_chat_message_sync.side_effect = KeyError("Missing key")
        data = {"prompt": "Question", "history": []}

        response = self.client.post(self.url, data=data, format="json")

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn("error", response.data)

    @patch("common.views.GEMINI_CHAT_SERVICE")
    def test_chat_empty_prompt(self, mock_service):
        """Test chat API handles empty prompt"""
        mock_service.send_chat_message_sync.return_value = (
            "Response",
            [
                Content(role="user", parts=[{"text": ""}]),
                Content(role="model", parts=[{"text": "Response"}]),
            ],
        )
        data = {"prompt": "", "history": []}

        response = self.client.post(self.url, data=data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
