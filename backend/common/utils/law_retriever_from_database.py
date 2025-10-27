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
                "port": "5432"
            }

        self.conn = psycopg2.connect(**db_config)
        self.model = TextEmbedding(model_name=model_name)


    def get_relevant_laws(self, prompt: str, k: int = 10, min_words: int = 17) -> list[str]:
        if not prompt.strip():
            return []
        query_vec = next(iter(self.model.embed([prompt]))).tolist()

        with self.conn.cursor() as cur:
            cur.execute("""
                SELECT text
                FROM laws
                WHERE text IS NOT NULL
                ORDER BY embedding <-> (%s)::vector
                LIMIT %s;
            """, (query_vec, k))
            results = cur.fetchall()

        laws = []
        for r in results:
            if not r[0]:
                continue

            cleaned = self._clean_text(r[0])

            if len(cleaned.split()) >= min_words:
                laws.append(cleaned)
        return laws
    
    def _clean_text(self, text: str) -> str:
        """
        Intern hjelpefunksjon for å rydde bort metadata.
        """
        import re
        text = re.sub(
            r'\b(XML generert|LegacyID|DocumentID|Departement|Publisert i|Korttittel|Tittel|Innhold|Kunngjort|Annet om dokumentet|Etat|Hjemmel|Endrer|I kraft fra)\b.*?(?=[A-ZÆØÅa-zæøå]|$)',
            '', text, flags=re.DOTALL
        )
        text = re.sub(r'\s+', ' ', text).strip()
        sections = re.findall(r'(§\s*\d+[a-zA-Z]*.*?)(?=(?:§|\Z))', text, flags=re.DOTALL)
        if sections:
            text = " ".join(sections)
        if len(text.split()) > 600:
            text = " ".join(text.split()[:600])
        return text
