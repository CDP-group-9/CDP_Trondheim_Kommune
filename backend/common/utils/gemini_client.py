import logging

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
