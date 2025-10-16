from django.core.management.base import BaseCommand

from asgiref.sync import async_to_sync
from common.utils.gemini_client import GeminiAPIClient


# Command to test the Gemini API client
# Open docker desktop terminal and make sure you are in the backend directory
# Run the command: docker exec -it cdp_trondheim_kommune-backend-1 python manage.py test_gemini


class Command(BaseCommand):
    help = """Test the Gemini API client by running all tests, or a specific test.
    \nExample usage: docker exec -it cdp_trondheim_kommune-backend-1 python manage.py test_gemini --test chat""" # noqa: A001

    def add_arguments(self, parser):
        parser.add_argument(
            "--test",
            type=str,
            help="Specify which test to run (list_models, chat, embeddings, all)",
            default="all",
        )

    def handle(self, *args, **options):
        try:
            client = GeminiAPIClient()
            test_type = options["test"]

            self.stdout.write(self.style.MIGRATE_HEADING(f"Running Gemini test: {test_type}"))

            if test_type in ["list_models", "all"]:
                self.test_list_models(client)

            if test_type in ["chat", "all"]:
                self.test_quick_chat(client)

            if test_type in ["async_chat", "all"]:
                async_to_sync(self.test_async_chat)(client)

            self.stdout.write(self.style.SUCCESS("✅ All requested Gemini tests succeeded!"))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Test '{test_type}' failed: {e}"))
            raise

    def test_list_models(self, client: GeminiAPIClient):
        try:
            models = client.get_models_list()
            self.stdout.write(self.style.SUCCESS("✅ Fetched models successfully!"))
            for model in models:
                self.stdout.write(f"- {model}")
        except Exception:
            self.stdout.write(self.style.ERROR("❌ Failed to fetch models"))
            raise

    def test_quick_chat(self, client: GeminiAPIClient):
        try:
            model_name = "gemini-2.5-flash"
            messages = ["Jeg har 2 hunder hjemme", "Hvor mange poter er det i huset mitt?"]

            chat_history = client.quick_chat(model_name, messages)
            for message, reply in chat_history:
                self.stdout.write(f"User: {message}\nGemini: {reply}\n")

            self.stdout.write(self.style.SUCCESS("✅ Gemini chat succeeded!"))
        except Exception:
            self.stdout.write(self.style.ERROR("❌ Gemini chat failed"))
            raise

    async def test_async_chat(self, client: GeminiAPIClient):
        try:
            context_text = """Lov om hundehold (hundeloven)
            § 3. Eierens ansvar
            Eier av hund skal sørge for at hunden ikke volder skade på personer, dyr eller eiendom.
            § 4. Båndtvang
            Hunder skal holdes i bånd eller på innhegnet område fra 1. april til 20. august.
            § 5. Tilsyn
            Hunder skal holdes under forsvarlig tilsyn til enhver tid."""

            model_name = "gemini-2.5-flash"
            messages = ["Jeg har 2 hunder hjemme", "Hvor mange poter er det i huset mitt?"]

            response, chat_history = await client.async_send_chat_message(prompt=messages[0], model_name=model_name, current_history=[], context_text=context_text)
            self.stdout.write(f"User: {messages[0]}\nGemini: {response}\n")

            response, chat_history = await client.async_send_chat_message(prompt=messages[1], model_name=model_name, current_history=chat_history, context_text=context_text)
            self.stdout.write(f"User: {messages[1]}\nGemini: {response}\n")

            self.stdout.write(self.style.SUCCESS("✅ Gemini async chat succeeded!"))
        except Exception:
            self.stdout.write(self.style.ERROR("❌ Gemini async chat failed"))
            raise
