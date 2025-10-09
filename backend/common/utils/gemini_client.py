import logging
import time

from django.conf import settings

from google import genai
from google.genai import types


logger = logging.getLogger(__name__)


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

        self.api_key = api_key or getattr(settings, "GEMINI_API_KEY", None)
        if self.api_key is None:
            raise ValueError(
                "GEMINI_API_KEY must be set in environment variables or passed as an argument."
            )

        self.timeout = timeout

        # Initialize the Gemini client
        self.client = genai.Client(
            api_key=self.api_key, http_options=types.HttpOptions(timeout=10000)
        )

    def test_connection(self) -> bool:
        """
        Tests the connection to the Gemini API by making a simple request.

        Returns:
            bool: True if the connection is successful, False otherwise.
        """
        try:
            # Example of a simple request to test the connection
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
                response = self.client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents="Explain how AI works in a few words",
                )
                return response.text

            except Exception as e:
                logger.warning(
                    f"Attempt {attempt}/{max_retries}: Request failed ({e}). Retrying in {backoff}s..."
                )
                time.sleep(backoff)
                backoff *= 2  # exponential backoff

        raise TimeoutError(f"Gemini API request failed after {max_retries} retries.")
