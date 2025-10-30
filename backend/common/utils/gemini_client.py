import logging
import re
import time

from django.conf import settings

from google import genai
from google.genai import types
from google.genai.types import Content, GenerateContentConfig, Part

# from ..law_retriever import LawRetriever
from .law_retriever_from_database import LawRetriever


logger = logging.getLogger(__name__)


class GeminiAPIClient:
    """
    A client for interacting with the Gemini API.
    """

    def __init__(self, api_key: str | None = None, timeout: int = 300):
        """
        Initializes the GeminiAPIClient with the provided API key and timeout.

        Args:
            api_key (str): The API key for authenticating with the Gemini API.
            timeout (int): The timeout for API requests in seconds.
        """

        self.api_key = api_key or getattr(settings, "GEMINI_API_KEY", None)
        if self.api_key is None:
            raise ValueError(
                "GEMINI_API_KEY must be set in environment variables or passed as an argument."
            )

        self.timeout = timeout
        self.client = None
        self.async_client = None

        # # Initialize the Gemini client
        # self.client = genai.Client(
        #     api_key=self.api_key, http_options=types.HttpOptions(timeout=10000)
        # )

        # self.async_client = self.client.aio
        self.standard_model = "gemini-2.5-flash-lite"
        self.system_instructions = "You are a law assistant. Answer the questions based on Norwegian law and as concise as possible. If given additional context that are laws, refer to them when relevant. No more than 50 words. Answer in Norwegian."

    def start_client(self) -> None:
        if self.client is None:
            # Initialize the Gemini client
            self.client = genai.Client(
                api_key=self.api_key, http_options=types.HttpOptions(timeout=50000)
            )
        if self.async_client is None:
            self.async_client = self.client.aio

    def test_connection(self) -> bool:
        """
        Tests the connection to the Gemini API by making a simple request.

        Returns:
            bool: True if the connection is successful, False otherwise.
        """
        try:
            # Example of a simple request to test the connection
            self.start_client()
            self.client.models.list()
            logger.info("Successfully connected to Gemini API.")
            return True
        except Exception as e:
            logger.error("Failed to connect to Gemini API: %s", e)
            raise

    def simple_request(self) -> str:
        """
        Makes a simple request to the Gemini API with the given model and prompt.

        Args:
            model (str): The model to use for the request.
            prompt (str): The prompt to send to the model.

        Returns:
            str: The response from the model.
        """

        max_retries = 2
        backoff = 2  # seconds between retries

        for attempt in range(1, max_retries + 1):
            try:
                self.start_client()
                response = self.client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents="Explain how AI works in a few words",
                )
                logger.info("Gemini API request succeeded\n %s", response.text)
                return response.text

            except Exception as e:
                logger.exception(
                    "Attempt %d/%d: Request failed (%s). Retrying in %ds...",
                    attempt,
                    max_retries,
                    e,
                    backoff,
                )
                time.sleep(backoff)
                backoff *= 2  # exponential backoff

        raise TimeoutError(f"Gemini API request failed after {max_retries} retries.")

    def get_models_list(self) -> list:
        """
        Fetches a list of available models from the Gemini API.

        Returns:
            list: A list of available models.
        """
        try:
            self.start_client()
            models = self.client.models.list()
            model_names = [model.name for model in models]
            # logger.info("Fetched models: %s", model_names)
            return model_names
        except Exception as e:
            logger.error("Failed to fetch models from Gemini API: %s", e)
            raise

    def get_model_details(self, model_name: str) -> dict:
        """
        Fetches details of a specific model from the Gemini API.

        Args:
            model_name (str): The name of the model to fetch details for.

        Returns:
            dict: A dictionary containing model details.
        """
        try:
            self.start_client()
            model = self.client.models.get(model_name)
            model_details = {
                "name": model.name,
                "description": model.description,
                "version": model.version,
                "supported_actions": model.supported_actions,
            }
            return model_details
        except Exception as e:
            logger.exception("Failed to fetch model details from Gemini API: %s", e)
            raise

    def quick_chat(self, model_name: str, messages: list[str]) -> list[(str, str)]:
        """
        Engages in a quick chat with the specified model using the provided messages.

        Args:
            model_name (str): The name of the model to chat with.
            messages (list): A list of messages to send to the model.
        Returns:
            list[str]: A list of responses from the model.
        """
        try:
            self.start_client()
            chat = self.client.chats.create(model=model_name)
            history = []

            for message in messages:
                if not isinstance(message, str):
                    raise ValueError("All messages must be of type string.")

                response = chat.send_message(
                    message=message,
                )

                history.append((message, response.text))

            return history
        except Exception as e:
            logger.error("Failed to engage in chat with Gemini API: %s", e)
            raise

    def start_new_chat(self, model_name: str):
        """
        Starts a new chat session with the specified model.

        Args:
            model_name (str): The name of the model to chat with.

        Returns:
            chat object: A chat session object.
        """
        try:
            self.start_client()
            self.chat = self.client.chats.create(model=model_name)
            return self.chat
        except Exception as e:
            logger.error("Failed to start a new chat with Gemini API: %s", e)
            raise

    def continue_chat(self, message: str) -> str:
        """
        Continues the current chat session by sending a message.

        Args:
            message (str): The message to send to the model.

        Returns:
            str: The response from the model.
        """
        if not hasattr(self, "chat"):
            raise ValueError("No active chat session. Please start a new chat first.")

        try:
            self.start_client()
            response = self.chat.send_message(message=message)
            return response.text
        except Exception as e:
            logger.error("Failed to continue chat with Gemini API: %s", e)
            raise

    async def async_quick_chat(self, model_name: str, messages: list[str]) -> list[(str, str)]:
        """
        Engages in a quick chat with the specified model using the provided messages.

        Args:
            model_name (str): The name of the model to chat with.
            messages (list): A list of messages to send to the model.
        Returns:
            list[str]: A list of responses from the model.
        """
        try:
            self.start_client()
            chat = self.async_client.chats.create(model=model_name)
            history = []

            for message in messages:
                if not isinstance(message, str):
                    raise ValueError("All messages must be of type string.")

                response = await chat.send_message(
                    message=message,
                )

                history.append((message, response.text))

            return history
        except Exception as e:
            logger.error("Failed to engage in chat with Gemini API: %s", e)
            raise

    async def async_send_chat_message(
        self,
        prompt: str,
        current_history: list[Content],
        system_instruction: str | None = None,
        model_name: str = "gemini-2.5-flash",
        context_text: str | None = None,
    ) -> tuple[str, list[Content]]:
        """
        Sends a message to the Gemini API asynchronously and returns the response.

        Args:
            system_instruction (str): Optional system instruction to guide the model's behavior.
            prompt (str): The user's prompt or question.
            current_history (list[Content]): The current chat history as a list of Content objects.
            model_name (str): The name of the model to use for the chat.

        Returns:
            tuple[str, list[Content]]: The response and the updated chat history including the model's response.
        """

        if system_instruction is None:
            system_instruction = self.system_instructions

        config = None
        if system_instruction:
            config = GenerateContentConfig(system_instruction=system_instruction)

        user_parts = []

        if context_text:
            # Add the context first
            user_parts.append(
                Part(
                    text=f"CONTEXT: The following text provides relevant information:\n\n---\n{context_text}\n---"
                )
            )

        # Add the actual user prompt
        user_parts.append(Part(text=f"USER QUESTION: {prompt}"))

        try:
            self.start_client()
            async_chat_session = self.async_client.chats.create(
                model=model_name,
                history=current_history,
                config=config,
            )
            response = await async_chat_session.send_message(user_parts)

            updated_history = async_chat_session.get_history()

            return response.text, updated_history
        except Exception as e:
            logger.error("Failed to send async chat message to Gemini API: %s", e)
            raise

    def send_question_with_laws(
        self,
        prompt: str,
        current_history: list[Content],
        system_instruction: str | None = None,
        model_name: str = "gemini-2.5-flash",
        context_text: str | None = None,
    ) -> tuple[str, list[Content]]:
        """
        Henter relevante lover via RAG og sender dem som kontekst til Gemini.
        """
        law_retriever = LawRetriever()

        if system_instruction is None:
            system_instruction = self.system_instructions

        config = (
            GenerateContentConfig(system_instruction=system_instruction)
            if system_instruction
            else None
        )
        user_parts = []

        model_name = model_name or self.standard_model

        # Hent relevante lover og paragraftekster
        laws_data = law_retriever.retrieve(prompt, k_laws=3, k_paragraphs=20)

        rag_context = ""

        if laws_data.get("paragraphs"):
            paragraphs_with_law_info = []
            total_words = 0
            max_words = 400

            for p in laws_data["paragraphs"]:
                law_info = None
                for law in laws_data.get("laws", []):
                    if law["law_id"] == p["law_id"]:
                        law_info = law.get("metadata", {})
                        break

                law_title = "Ukjent lov"
                if law_info and isinstance(law_info, dict):
                    law_title = law_info.get("title", f"Lov ID {p['law_id']}")
                elif law_info:
                    law_title = str(law_info)
                else:
                    law_title = f"Lov ID {p['law_id']}"

                print(f"Cosine Distance: {p['cosine_distance']:.4f} - {p['paragraph_number']}")

                para_text = f"Fra {law_title} - {p['paragraph_number']}: {p['text']}"
                para_words = len(re.findall(r"\w+", para_text))

                if total_words + para_words > max_words:
                    break

                paragraphs_with_law_info.append(para_text)
                total_words += para_words

            rag_context = "Relevante paragrafer:\n" + "\n\n".join(paragraphs_with_law_info)

            print(
                f":receipt: Sendte {len(paragraphs_with_law_info)} paragrafer ({total_words} ord) til Gemini."
            )
            print("Paragraftekster som ble sendt:\n", rag_context)

        # Combine contexts
        if context_text and rag_context:
            combined_context = context_text + "\n\n---\n\n" + rag_context
        elif context_text:
            combined_context = context_text
        elif rag_context:
            combined_context = rag_context
        else:
            combined_context = ""

        # Legg til kontekst i user_parts
        if combined_context:
            user_parts.append(
                Part(
                    text=f"KONTEKST: Følgende informasjon kan brukes for å begrunne eller forbedre svaret:\n\n---\n{combined_context}\n---"
                )
            )

        # Legg til brukerens spørsmål
        user_parts.append(Part(text=f"USER QUESTION: {prompt}"))

        try:
            self.start_client()
            chat_session = self.client.chats.create(
                model=model_name,
                history=current_history,
                config=config,
            )
            response = chat_session.send_message(user_parts)
            updated_history = chat_session.get_history()
            full_response = response.text

            if combined_context:
                full_response += "\n\n---\nKontekst som ble sendt til Gemini:\n" + combined_context

            return full_response, updated_history

        except Exception as e:
            logger.error("Failed to send sync chat message to Gemini API: %s", e)
            raise


# Runs ONCE when the django server process loads this module
GEMINI_CHAT_SERVICE = GeminiAPIClient()
