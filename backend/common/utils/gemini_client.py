import logging
import time
from typing import Optional
import json

from django.conf import settings

from google import genai
from google.genai import types
from google.genai.client import AsyncClient
from google.genai.types import Content, Part, GenerateContentConfig
# from ..preprocessing import find_law
#from common.preprocessing import find_law


logger = logging.getLogger(__name__)
#from ..rag_test import LawRetriever

# Lag en global instans
# self.law_retriever = LawRetriever(json_folder="/home/user/app/backend/common/lovdata_test")
# conversation_history: list[Content] = []


class GeminiAPIClient:
    """
    A client for interacting with the Gemini API.
    """

    def __init__(self, api_key: str | None = None, timeout: int = 10):
        """
        Initializes the GeminiAPIClient with the provided API key and timeout.

        Args:
            api_key (str): The API key for authenticating with the Gemini API.
            timeout (int): The timeout for API requests in seconds.
        """

        # self.law_retriever = LawRetriever(json_folder="/home/user/app/backend/common/lovdata_test")
        # conversation_history: list[Content] = []
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
        self.standard_model = "gemini-2.5-flash"
        self.system_instructions = "You are a law assistant. Answer the questions based on Norwegian law and as concise as possible. If given additional context that are laws, refer to them when relevant. No more than 50 words. Answer in Norwegian."

    def start_client(self) -> None:
        if self.client is None:
            # Initialize the Gemini client
            self.client = genai.Client(
                api_key=self.api_key, http_options=types.HttpOptions(timeout=10000)
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
                logger.warning(
                    f"Attempt {attempt}/{max_retries}: Request failed ({e}). Retrying in {backoff}s..."
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
            logger.error("Failed to fetch model details from Gemini API: %s", e)
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
    
    async def send_with_law_context(
        self,
        relevant_docs: list[dict],
        user_query: str,
        model_name: str = "gemini-2.5-flash",
        system_instruction: Optional[str] = None,
        current_history: Optional[list[Content]] = None,
    ) -> tuple[str, list[Content]]:
        """
        Sender et spørsmål til Gemini, basert på relevante lovdokumenter funnet av find_law().

        Args:
            relevant_docs: Liste med dokumenter (fra find_law), som inneholder minst 'text'.
            user_query: Spørsmålet brukeren stiller.
            model_name: Gemini-modell.
            system_instruction: Instruksjon for modellens stil/oppførsel.

        Returns:
            tuple[str, list[Content]]: Modellens svar og oppdatert historikk.
        """

        if not relevant_docs:
            raise ValueError("Ingen relevante dokumenter sendt til send_with_law_context().")

        # Hent tekst fra dokumentene
        context_snippets = [doc.get("text", "").strip() for doc in relevant_docs if doc.get("text")]
        if not context_snippets:
            raise ValueError("Ingen tekst funnet i de relevante dokumentene.")

        # Slå sammen til en kontekststreng
        context_text = "\n\n---\n\n".join(context_snippets)

        # Lag prompten
        prompt = f"Bruk konteksten under til å svare på spørsmålet:\n\n'{user_query}'"

        # Bruk eksisterende async_send_chat_message til å spørre Gemini
        response_text, updated_history = await self.client.async_send_chat_message(
            prompt=prompt,
            current_history=current_history or [],
            system_instruction=system_instruction or "Svar presist og faglig basert på konteksten nedenfor.",
            model_name=model_name,
            context_text=context_text,
        )

        return response_text, updated_history

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
                Part(text=f"CONTEXT: The following text provides relevant information:\n\n---\n{context_text}\n---")
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
            response = await async_chat_session.send_message(
                user_parts
            )

            updated_history = async_chat_session.get_history()

            return response.text, updated_history
        except Exception as e:
            logger.error("Failed to send async chat message to Gemini API: %s", e)
            raise
    

    # async def async_rag_chatbot(
    #     input_text: str,
    #     history: list[Content],
    #     top_k=3,  # færre lover for å redusere prompt-størrelse
    #     max_law_chars=200,  # maks antall tegn per lov
    #     max_history_msgs=1,  # maks antall meldinger fra historikken
    #     preview_only=False
    #     ):
    #     # --- Hent relevante lover fra FAISS ---
    #     relevant_laws = law_retriever.query(input_text, top_k=top_k)

    #     # Kutt lovteksten til max_law_chars
    #     context_laws = "\n\n".join([
    #         f"{law['title']} ({law['chapter']}): {law['text'][:max_law_chars]}..."
    #         for law in relevant_laws
    #     ])

    #     # Ta kun de siste max_history_msgs meldinger
    #     last_history_text = "\n".join([
    #         f"{c.role}: {getattr(c, 'text', '') or getattr(c.parts[0], 'text', '')}"
    #         for c in history[-max_history_msgs:]
    #     ])

    #     # Bygg full context
    #     full_context = (
    #         f"=== RELEVANTE LOVER ===\n{context_laws}\n\n"
    #         f"=== SAMTALEHISTORIKK ===\n{last_history_text}\n\n"
    #         f"=== SPØRSMÅL ===\n{input_text}\n\nSvar:"
    #     )

    #     # if preview_only:
    #     #     print("\n--- PREVIEW AV PROMPT SOM VIL SENDES TIL GEMINI ---\n")
    #     #     print(full_context)
    #     #     return "Preview complete."
    #     # 🧩 Debug – alltid vis prompten og størrelsen
    #     # print("\n--- PROMPT SOM SENDES TIL GEMINI ---")
    #     # print(f"🧩 Lengde på prompt: {len(full_context)} tegn\n")
    #     # print(full_context)
    #     # print("\n--- SLUTT PÅ PROMPT ---\n")

    # # if preview_only:
    # #     return "Preview complete."

    #     # Send meldingen til Gemini
    #     response_text, updated_history = await GEMINI_CHAT_SERVICE.async_send_chat_message(
    #         # prompt=input_text,
    #         prompt=full_context,
    #         current_history=history,
    #         #context_text=full_context,
    #         system_instruction="Svar som en juridisk ekspert"
    #     )

    #     return response_text, updated_history, full_context
    # async def async_rag_chatbot(
    #     self,
    #     input_text: str,
    #     history: list[Content],
    #     top_k=1,
    #     max_law_chars=50,
    #     max_history_msgs=1,
    #     preview_only=False
    # ):
    #     # --- Hent relevante lover fra FAISS ---
    #     relevant_laws = self.law_retriever.query(input_text, top_k=top_k)

    #     # Kutt lovteksten
    #     context_laws = "\n\n".join([
    #         f"{law['title']} ({law['chapter']}): {law['text'][:max_law_chars]}..."
    #         for law in relevant_laws
    #     ])

    #     # Ta kun de siste max_history_msgs meldinger
    #     last_history_text = "\n".join([
    #         f"{c.role}: {getattr(c, 'text', '') or getattr(c.parts[0], 'text', '')}"
    #         for c in history[-max_history_msgs:]
    #     ])

    #     # Bygg full context
    #     full_context = (
    #         f"=== RELEVANTE LOVER ===\n{context_laws}\n\n"
    #         f"=== SAMTALEHISTORIKK ===\n{last_history_text}\n\n"
    #         f"=== SPØRSMÅL ===\n{input_text}\n\nSvar:"
    #     )

    #     if preview_only:
    #         print("\n--- PREVIEW AV FULL CONTEXT ---")
    #         print(full_context)
    #         print("\n--- SLUTT ---\n")

    #     # Returner bare full_context og historikk, ikke kall Gemini her
    #     return None, history, full_context

# Runs ONCE when the django server process loads this module
GEMINI_CHAT_SERVICE = GeminiAPIClient()
