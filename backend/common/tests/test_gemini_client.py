from unittest.mock import MagicMock, patch

from django.test import TestCase, override_settings

from google.genai.types import Content, Part

from common.utils.gemini_client import GEMINI_CHAT_SERVICE, GeminiAPIClient


class GeminiAPIClientInitTest(TestCase):
    @override_settings(GEMINI_API_KEY="test-api-key")
    def test_init_with_settings_api_key(self):
        """Test initializing client with API key from settings"""
        client = GeminiAPIClient()

        self.assertEqual(client.api_key, "test-api-key")
        self.assertEqual(client.timeout, 300)

    def test_init_with_custom_timeout(self):
        """Test initializing client with custom timeout"""
        client = GeminiAPIClient(api_key="test-key", timeout=30)

        self.assertEqual(client.timeout, 30)

    @override_settings(GEMINI_API_KEY=None)
    def test_init_without_api_key_raises_error(self):
        """Test that initializing without API key raises ValueError"""
        with self.assertRaises(ValueError) as context:
            GeminiAPIClient(api_key=None)

        self.assertIn("GEMINI_API_KEY", str(context.exception))


class GeminiAPIClientStartClientTest(TestCase):
    @patch("common.utils.gemini_client.genai.Client")
    def test_start_client_initializes_client(self, mock_client_class):
        """Test that start_client initializes the client"""
        mock_client = MagicMock()
        mock_client_class.return_value = mock_client

        client = GeminiAPIClient(api_key="test-key")
        client.start_client()

        self.assertIsNotNone(client.client)
        mock_client_class.assert_called_once()

    @patch("common.utils.gemini_client.genai.Client")
    def test_start_client_only_once(self, mock_client_class):
        """Test that start_client only initializes once even when called multiple times"""
        mock_client = MagicMock()
        mock_client_class.return_value = mock_client

        client = GeminiAPIClient(api_key="test-key")
        client.start_client()
        client.start_client()

        mock_client_class.assert_called_once()


class GeminiAPIClientSendQuestionTest(TestCase):
    @patch("common.utils.gemini_client.LawRetriever")
    @patch("common.utils.gemini_client.genai.Client")
    def test_send_question_with_laws_success(self, mock_client_class, mock_law_retriever_class):
        """Test send_question_with_laws sends message and returns response with history"""
        mock_response = MagicMock()
        mock_response.text = "Response to legal question"

        mock_chat = MagicMock()
        mock_chat.send_message.return_value = mock_response
        mock_chat.get_history.return_value = [
            Content(role="user", parts=[Part(text="Legal question")]),
            Content(role="model", parts=[Part(text="Response to legal question")]),
        ]

        mock_client = MagicMock()
        mock_client.chats.create.return_value = mock_chat
        mock_client_class.return_value = mock_client

        mock_law_retriever = MagicMock()
        mock_law_retriever.retrieve.return_value = {
            "paragraphs": [],
            "laws": []
        }
        mock_law_retriever_class.return_value = mock_law_retriever

        client = GeminiAPIClient(api_key="test-key")
        response_text, history = client.send_question_with_laws(
            prompt="Legal question",
            current_history=[]
        )

        self.assertEqual(response_text, "Response to legal question")
        self.assertEqual(len(history), 2)
        mock_law_retriever.retrieve.assert_called_once()

    @patch("common.utils.gemini_client.LawRetriever")
    @patch("common.utils.gemini_client.genai.Client")
    def test_send_question_with_context_and_system_instruction(
        self, mock_client_class, mock_law_retriever_class
    ):
        """Test sending message with context and system instruction"""
        mock_response = MagicMock()
        mock_response.text = "Response"

        mock_chat = MagicMock()
        mock_chat.send_message.return_value = mock_response
        mock_chat.get_history.return_value = []

        mock_client = MagicMock()
        mock_client.chats.create.return_value = mock_chat
        mock_client_class.return_value = mock_client

        mock_law_retriever = MagicMock()
        mock_law_retriever.retrieve.return_value = {
            "paragraphs": [],
            "laws": []
        }
        mock_law_retriever_class.return_value = mock_law_retriever

        client = GeminiAPIClient(api_key="test-key")
        client.send_question_with_laws(
            prompt="Question",
            current_history=[],
            context_text="Context",
            system_instruction="Be helpful",
        )

        call_kwargs = mock_client.chats.create.call_args[1]
        self.assertIn("config", call_kwargs)

    @patch("common.utils.gemini_client.LawRetriever")
    @patch("common.utils.gemini_client.genai.Client")
    def test_send_question_with_custom_model(self, mock_client_class, mock_law_retriever_class):
        """Test sending message with custom model name"""
        mock_response = MagicMock()
        mock_response.text = "Response"

        mock_chat = MagicMock()
        mock_chat.send_message.return_value = mock_response
        mock_chat.get_history.return_value = []

        mock_client = MagicMock()
        mock_client.chats.create.return_value = mock_chat
        mock_client_class.return_value = mock_client

        mock_law_retriever = MagicMock()
        mock_law_retriever.retrieve.return_value = {
            "paragraphs": [],
            "laws": []
        }
        mock_law_retriever_class.return_value = mock_law_retriever

        client = GeminiAPIClient(api_key="test-key")
        client.send_question_with_laws(
            prompt="Question",
            current_history=[],
            model_name="gemini-pro"
        )

        call_kwargs = mock_client.chats.create.call_args[1]
        self.assertEqual(call_kwargs["model"], "gemini-pro")

    @patch("common.utils.gemini_client.LawRetriever")
    @patch("common.utils.gemini_client.genai.Client")
    def test_send_question_with_law_retrieval(self, mock_client_class, mock_law_retriever_class):
        """Test that law paragraphs are retrieved and included in context"""
        mock_response = MagicMock()
        mock_response.text = "Legal response"

        mock_chat = MagicMock()
        mock_chat.send_message.return_value = mock_response
        mock_chat.get_history.return_value = []

        mock_client = MagicMock()
        mock_client.chats.create.return_value = mock_chat
        mock_client_class.return_value = mock_client

        mock_law_retriever = MagicMock()
        mock_law_retriever.retrieve.return_value = {
            "paragraphs": [
                {
                    "law_id": "lov19670210001",
                    "paragraph_number": "§ 1",
                    "text": "Test law paragraph",
                    "cosine_distance": 0.1
                }
            ],
            "laws": [
                {
                    "law_id": "lov19670210001",
                    "metadata": {"title": "Test Law"}
                }
            ]
        }
        mock_law_retriever_class.return_value = mock_law_retriever

        client = GeminiAPIClient(api_key="test-key")
        response_text, _ = client.send_question_with_laws(
            prompt="Legal question",
            current_history=[]
        )

        # Response should include law links appended to the base response
        self.assertIn("Legal response", response_text)
        self.assertIn("Lovdata-lenker", response_text)
        mock_chat.send_message.assert_called_once()
        call_args = mock_chat.send_message.call_args[0][0]
        self.assertTrue(any("KONTEKST" in str(part.text) for part in call_args if hasattr(part, "text")))


class GeminiChatServiceTest(TestCase):
    def test_service_singleton_exists(self):
        """Test that GEMINI_CHAT_SERVICE singleton exists and is properly initialized"""
        self.assertIsNotNone(GEMINI_CHAT_SERVICE)
        self.assertIsInstance(GEMINI_CHAT_SERVICE, GeminiAPIClient)
