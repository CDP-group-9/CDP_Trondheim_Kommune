import re

from django.conf import settings

from google import genai
from google.genai import types
from google.genai.types import Content, GenerateContentConfig, Part

from .law_retriever_from_database import LawRetriever
from .logger import get_logger


logger = get_logger(name="cdp")


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

        self.standard_model = "gemini-2.5-flash"
        self.system_instructions = "You are a law assistant. Answer the questions based on Norwegian law and as concise as possible, but provide examples. Treat the question as if it comes from an external user, not employed in Trondheim kommune. If given additional context that are laws, refer to them when relevant. No more than 250 words. Answer in Norwegian."

    def start_client(self) -> None:
        if self.client is None:
            self.client = genai.Client(
                api_key=self.api_key, http_options=types.HttpOptions(timeout=50000)
            )

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

        laws_data = law_retriever.retrieve(prompt, k_laws=3, k_paragraphs=20)

        rag_context = ""
        if laws_data.get("paragraphs"):
            paragraphs_with_law_info = []
            total_words = 0
            max_words = 400
            law_links = []

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

                # Build links to lovdata
                lov_id = p["law_id"]

                formatted_1 = f"{lov_id[3:7]}-{lov_id[7:9]}-{lov_id[9:12]}"
                formtatted_2 = lov_id[12:].lstrip("0")
                formatted = formatted_1 + formtatted_2
                paragraph_number = p.get("paragraph_number", "").replace("§", "").strip()
                if "sf" in lov_id:
                    lov_link = f"https://lovdata.no/dokument/LTI/forskrift/{formatted}"
                else:
                    lov_link = f"https://lovdata.no/dokument/LTI/lov/{formatted}"
                if paragraph_number:
                    lov_link += f"/§{paragraph_number}"

                para_text = f"Fra {law_title} - §{paragraph_number}: {p['text']}"

                para_words = len(re.findall(r"\w+", para_text))
                if total_words + para_words > max_words:
                    break

                paragraphs_with_law_info.append(para_text)
                law_links.append(f"{law_title} §{paragraph_number}: {lov_link}")
                total_words += para_words

            # Only send relevant paragraphs as context
            rag_context = "Relevante paragrafer:\n" + "\n\n".join(paragraphs_with_law_info)

            print(
                f":receipt: Sendte {len(paragraphs_with_law_info)} paragrafer ({total_words} ord) til Gemini."
            )
            print("Paragraftekster som ble sendt:\n", rag_context)
        else:
            rag_context = "Ingen relevante paragrafer ble funnet."
            law_links = []

        if context_text and rag_context:
            combined_context = context_text + "\n\n---\n\n" + rag_context
        elif context_text:
            combined_context = context_text
        elif rag_context:
            combined_context = rag_context
        else:
            combined_context = ""

        if combined_context:
            user_parts.append(
                Part(
                    text=f"KONTEKST: Følgende informasjon kan brukes for å begrunne eller forbedre svaret:\n\n---\n{combined_context}\n---"
                )
            )

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

            if law_links and "Relevante Lovdata-lenker" not in full_response:
                md_links = []
                for link in law_links:
                    if ": " in link:
                        text, url = link.split(": ", 1)
                        md_links.append(f"[{text}]({url})")
                    else:
                        md_links.append(link)
                full_response += "\n\n Relevante Lovdata-lenker:\n" + "\n".join(
                    f"- {md_link}" for md_link in md_links
                )
            return full_response, updated_history

        except Exception as e:
            logger.error("Failed to send sync chat message to Gemini API: %s", e)
            raise


# Runs ONCE when the django server process loads this module
GEMINI_CHAT_SERVICE = GeminiAPIClient()
