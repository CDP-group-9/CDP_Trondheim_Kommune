from unittest.mock import MagicMock, patch

from django.test import TestCase, override_settings

from google.genai.types import Content

from common.utils.gemini_client import GEMINI_CHAT_SERVICE, GeminiAPIClient


class GeminiAPIClientInitTest(TestCase):
    @override_settings(GEMINI_API_KEY="test-api-key")
    def test_init_with_settings_api_key(self):
        """Test initializing client with API key from settings"""
        client = GeminiAPIClient()

        self.assertEqual(client.api_key, "test-api-key")
        self.assertEqual(client.timeout, 10)

    def test_init_with_custom_timeout(self):
        """Test initializing client with custom timeout"""
        client = GeminiAPIClient(api_key="test-key", timeout=30)

        self.assertEqual(client.timeout, 30)

    @override_settings(GEMINI_API_KEY=None)
    @patch("common.utils.gemini_client.getattr")
    def test_init_without_api_key_raises_error(self, mock_getattr):
        """Test that initializing without API key raises ValueError"""
        mock_getattr.return_value = None

        with self.assertRaises(ValueError):
            GeminiAPIClient()


class GeminiAPIClientStartClientTest(TestCase):
    @patch("common.utils.gemini_client.genai.Client")
    def test_start_client_initializes_client(self, mock_client_class):
        """Test that start_client initializes both sync and async clients"""
        mock_client = MagicMock()
        mock_client.aio = MagicMock()
        mock_client_class.return_value = mock_client

        client = GeminiAPIClient(api_key="test-key")
        client.start_client()

        self.assertIsNotNone(client.client)
        self.assertIsNotNone(client.async_client)

    @patch("common.utils.gemini_client.genai.Client")
    def test_start_client_only_once(self, mock_client_class):
        """Test that start_client only initializes once even when called multiple times"""
        mock_client = MagicMock()
        mock_client.aio = MagicMock()
        mock_client_class.return_value = mock_client

        client = GeminiAPIClient(api_key="test-key")
        client.start_client()
        client.start_client()

        mock_client_class.assert_called_once()


class GeminiAPIClientConnectionTest(TestCase):
    @patch("common.utils.gemini_client.genai.Client")
    def test_connection_success(self, mock_client_class):
        """Test that test_connection returns True on successful connection"""
        mock_client = MagicMock()
        mock_client.models.list.return_value = []
        mock_client.aio = MagicMock()
        mock_client_class.return_value = mock_client

        client = GeminiAPIClient(api_key="test-key")
        result = client.test_connection()

        self.assertTrue(result)


class GeminiAPIClientSimpleRequestTest(TestCase):
    @patch("common.utils.gemini_client.genai.Client")
    def test_simple_request_success(self, mock_client_class):
        """Test successful simple_request returns generated text"""
        mock_response = MagicMock()
        mock_response.text = "AI works by processing data"

        mock_client = MagicMock()
        mock_client.models.generate_content.return_value = mock_response
        mock_client.aio = MagicMock()
        mock_client_class.return_value = mock_client

        client = GeminiAPIClient(api_key="test-key")
        result = client.simple_request()

        self.assertEqual(result, "AI works by processing data")

    @patch("common.utils.gemini_client.genai.Client")
    @patch("common.utils.gemini_client.time.sleep")
    def test_simple_request_retries_on_failure(self, mock_sleep, mock_client_class):
        """Test that simple_request retries on failure and raises TimeoutError"""
        mock_client = MagicMock()
        mock_client.models.generate_content.side_effect = [
            Exception("Failure"),
            Exception("Failure"),
        ]
        mock_client.aio = MagicMock()
        mock_client_class.return_value = mock_client

        client = GeminiAPIClient(api_key="test-key")

        with self.assertRaises(TimeoutError):
            client.simple_request()


class GeminiAPIClientModelManagementTest(TestCase):
    @patch("common.utils.gemini_client.genai.Client")
    def test_get_models_list(self, mock_client_class):
        """Test that get_models_list returns list of model names"""
        mock_model = MagicMock()
        mock_model.name = "gemini-pro"

        mock_client = MagicMock()
        mock_client.models.list.return_value = [mock_model]
        mock_client.aio = MagicMock()
        mock_client_class.return_value = mock_client

        client = GeminiAPIClient(api_key="test-key")
        models = client.get_models_list()

        self.assertIn("gemini-pro", models)

    @patch("common.utils.gemini_client.genai.Client")
    def test_get_model_details(self, mock_client_class):
        """Test that get_model_details returns model information"""
        mock_model = MagicMock()
        mock_model.name = "gemini-pro"
        mock_model.description = "A powerful model"

        mock_client = MagicMock()
        mock_client.models.get.return_value = mock_model
        mock_client.aio = MagicMock()
        mock_client_class.return_value = mock_client

        client = GeminiAPIClient(api_key="test-key")
        details = client.get_model_details("gemini-pro")

        self.assertEqual(details["name"], "gemini-pro")


class GeminiAPIClientChatTest(TestCase):
    @patch("common.utils.gemini_client.genai.Client")
    def test_quick_chat(self, mock_client_class):
        """Test quick_chat sends messages and returns history"""
        mock_response = MagicMock()
        mock_response.text = "Response"

        mock_chat = MagicMock()
        mock_chat.send_message.return_value = mock_response

        mock_client = MagicMock()
        mock_client.chats.create.return_value = mock_chat
        mock_client.aio = MagicMock()
        mock_client_class.return_value = mock_client

        client = GeminiAPIClient(api_key="test-key")
        history = client.quick_chat("gemini-pro", ["Hello"])

        self.assertEqual(len(history), 1)
        self.assertEqual(history[0][1], "Response")

    @patch("common.utils.gemini_client.genai.Client")
    def test_start_and_continue_chat(self, mock_client_class):
        """Test starting new chat and continuing with messages"""
        mock_response = MagicMock()
        mock_response.text = "Response"

        mock_chat = MagicMock()
        mock_chat.send_message.return_value = mock_response

        mock_client = MagicMock()
        mock_client.chats.create.return_value = mock_chat
        mock_client.aio = MagicMock()
        mock_client_class.return_value = mock_client

        client = GeminiAPIClient(api_key="test-key")
        client.start_new_chat("gemini-pro")
        response = client.continue_chat("Message")

        self.assertEqual(response, "Response")


class GeminiAPIClientSendMessageTest(TestCase):
    @patch("common.utils.gemini_client.genai.Client")
    def test_send_chat_message_sync(self, mock_client_class):
        """Test send_chat_message_sync sends message and returns response with history"""
        mock_response = MagicMock()
        mock_response.text = "Response"

        mock_chat = MagicMock()
        mock_chat.send_message.return_value = mock_response
        mock_chat.get_history.return_value = [
            Content(role="user", parts=[{"text": "Hello"}]),
            Content(role="model", parts=[{"text": "Response"}]),
        ]

        mock_client = MagicMock()
        mock_client.chats.create.return_value = mock_chat
        mock_client.aio = MagicMock()
        mock_client_class.return_value = mock_client

        client = GeminiAPIClient(api_key="test-key")
        response_text, history = client.send_chat_message_sync(prompt="Hello", current_history=[])

        self.assertEqual(response_text, "Response")
        self.assertEqual(len(history), 2)

    @patch("common.utils.gemini_client.genai.Client")
    def test_send_with_context_and_system_instruction(self, mock_client_class):
        """Test sending message with context and system instruction"""
        mock_response = MagicMock()
        mock_response.text = "Response"

        mock_chat = MagicMock()
        mock_chat.send_message.return_value = mock_response
        mock_chat.get_history.return_value = []

        mock_client = MagicMock()
        mock_client.chats.create.return_value = mock_chat
        mock_client.aio = MagicMock()
        mock_client_class.return_value = mock_client

        client = GeminiAPIClient(api_key="test-key")
        client.send_chat_message_sync(
            prompt="Question",
            current_history=[],
            context_text="Context",
            system_instruction="Be helpful",
        )

        call_kwargs = mock_client.chats.create.call_args[1]
        self.assertIn("config", call_kwargs)


class GeminiChatServiceTest(TestCase):
    def test_service_singleton_exists(self):
        """Test that GEMINI_CHAT_SERVICE singleton exists and is properly initialized"""
        self.assertIsNotNone(GEMINI_CHAT_SERVICE)
        self.assertIsInstance(GEMINI_CHAT_SERVICE, GeminiAPIClient)
