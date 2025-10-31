import re

import psycopg2
from fastembed import TextEmbedding


class LawRetriever:
    def __init__(self, db_config=None, model_name="BAAI/bge-small-en-v1.5"):
        if db_config is None:
            db_config = {
                "dbname": "CDP_Trondheim_Kommune",
                "user": "CDP_Trondheim_Kommune",
                "password": "password",
                "host": "db",
                "port": "5432",
            }

        self.conn = psycopg2.connect(**db_config)
        self.model = TextEmbedding(model_name=model_name)

    def retrieve(
        self,
        prompt: str,
        k_laws: int = 3,
        k_paragraphs: int | None = None,
        law_id: int | None = None,
        skip_law_search: bool = False,
    ) -> dict:
        """
        Hovedmetode for å hente relevante lover og/eller paragrafer.
        Hvis skip_law_search=True, hopper den over lov-søk og søker direkte i alle paragrafer.
        Hvis law_id er satt, søker den kun i paragrafer fra den loven.
        """
        if not prompt.strip():
            return {}

        result = {}

        if skip_law_search:
            result["laws"] = []
            result["paragraphs"] = self._retrieve_paragraphs(prompt, None, k_paragraphs)
            return result

        if law_id is None:
            law_results = self._retrieve_laws(prompt, k_laws)
            if not law_results:
                return {"laws": [], "paragraphs": []}

            result["laws"] = [
                {"law_id": law_id, "metadata": law_metadata} for law_id, law_metadata in law_results
            ]

            law_ids = [law_id for law_id, _ in law_results]
        else:
            result["laws"] = [{"law_id": law_id}]
            law_ids = [law_id]

        # Retrieve paragraphs from all relevant laws
        paragraphs = self._retrieve_paragraphs_from_laws(prompt, law_ids, k_paragraphs)
        result["paragraphs"] = paragraphs

        # Combine paragraphs into one text
        result["paragraphs_text"] = "\n\n".join(
            [f"{p['paragraph_number']}: {p['text']}" for p in paragraphs]
        )

        return result

    def _retrieve_laws(self, prompt: str, k_laws: int):
        query_vec = next(iter(self.model.embed([prompt]))).tolist()
        with self.conn.cursor() as cur:
            cur.execute(
                """
                SELECT law_id, metadata
                FROM laws
                WHERE embedding IS NOT NULL
                ORDER BY embedding <=> (%s)::vector(384)
                LIMIT %s;
            """,
                (query_vec, k_laws),
            )
            return cur.fetchall()

    def _retrieve_paragraphs_from_laws(self, prompt: str, law_ids: list, k_paragraphs: int):
        query_vec = next(iter(self.model.embed([prompt]))).tolist()
        with self.conn.cursor() as cur:
            if law_ids:
                cur.execute(
                    """
                    SELECT paragraph_id, paragraph_number, text, metadata, law_id,
                           embedding <=> (%s)::vector(384) as cosine_distance
                    FROM paragraphs
                    WHERE law_id = ANY(%s) AND embedding IS NOT NULL
                    ORDER BY cosine_distance
                    LIMIT %s;
                """,
                    (query_vec, law_ids, k_paragraphs),
                )
            else:
                cur.execute(
                    """
                    SELECT paragraph_id, paragraph_number, text, metadata, law_id,
                           embedding <=> (%s)::vector(384) as cosine_distance
                    FROM paragraphs
                    WHERE embedding IS NOT NULL
                    ORDER BY cosine_distance
                    LIMIT %s;
                """,
                    (query_vec, k_paragraphs),
                )
            results = cur.fetchall()

        # Removes first chapter "lovens formål og virkeområde"
        results = [r for r in results if not re.match(r"^§\s*1\b", str(r[1]))]

        return [
            {
                "paragraph_id": pid,
                "paragraph_number": pnum,
                "text": self._clean_text(txt),
                "metadata": meta,
                "law_id": law_id,
                "cosine_distance": float(similarity),
            }
            for pid, pnum, txt, meta, law_id, similarity in results
        ]

    def _clean_text(self, text: str) -> str:
        text = re.sub(
            r"\b(XML generert|LegacyID|DocumentID|Departement|Publisert i|Korttittel|Tittel|Innhold|Kunngjort|Annet om dokumentet|Etat|Hjemmel|Endrer|I kraft fra)\b.*?(?=[A-ZÆØÅa-zæøå]|$)",
            "",
            text,
            flags=re.DOTALL,
        )
        text = re.sub(r"\s+", " ", text).strip()
        sections = re.findall(r"(§\s*\d+[a-zA-Z]*.*?)(?=(?:§|\Z))", text, flags=re.DOTALL)
        if sections:
            text = " ".join(sections)
        if len(text.split()) > 600:
            text = " ".join(text.split()[:600])
        return text
