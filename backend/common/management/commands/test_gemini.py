from django.core.management.base import BaseCommand

from common.utils.gemini_client import GeminiAPIClient


# Command to test the Gemini API client
# Open docker desktop terminal and make sure you are in the backend directory
# Run the command: docker exec -it cdp_trondheim_kommune-backend-1 python manage.py test_gemini


class Command(BaseCommand):
    assist = "Test the Gemini API client by fetching a list of models from the API."

    def handle(self, *args, **options):
        try:
            client = GeminiAPIClient()
            client.test_connection()
            self.stdout.write(self.style.SUCCESS("✅ Gemini API call succeeded!"))
        except Exception as e:
            self.stdout.write(self.style.ERROR("❌ Gemini API call failed: %s", e))
            raise
