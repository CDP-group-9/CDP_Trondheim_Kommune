import psycopg2
import numpy as np
#from sentence_transformers import SentenceTransformer
import ast

class LawRetriever:
    def __init__(self, db_config=None, model_name="all-MiniLM-L6-v2"):
        if db_config is None:
            db_config = {
                "dbname": "CDP_Trondheim_Kommune",
                "user": "CDP_Trondheim_Kommune",
                "password": "password",
                "host": "host.docker.internal",  # 'db' hvis i Docker
                "port": "5433"
            }

        self.conn = psycopg2.connect(**db_config)
        self.model = None
        self.model_name = model_name

    # def get_model():
    #     from sentence_transformers import SentenceTransformer
    #     model_name="all-MiniLM-L6-v2"
    #     model = SentenceTransformer(model_name)
    #     return model

    def get_relevant_laws(self, prompt: str, k: int = 10, min_words: int = 17) -> list[str]:
        if not prompt.strip():
            return []
        model = self.get_model()
        # Embed spørsmålet
        # query_vec = self.model.encode(prompt).tolist()
        query_vec = model.encode(prompt).tolist() 

        with self.conn.cursor() as cur:
            cur.execute("""
                SELECT text
                FROM laws
                WHERE text IS NOT NULL
                ORDER BY embedding <-> (%s)::vector
                LIMIT %s;
            """, (query_vec, k))
            results = cur.fetchall()

        laws = [r[0] for r in results if r[0] and len(r[0].split()) >= min_words]
        return laws