import faiss
import numpy as np
import json
from sentence_transformers import SentenceTransformer
import os
import time

class LawRetriever:
    """
    Initialiserer FAISS-indeks, metadata og embedding-modell.
    """

    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        start_load = time.time()

        base_dir = os.path.dirname(os.path.abspath(__file__))
        index_path = os.path.join(base_dir, "preprocessing/laws.index")
        metadata_path = os.path.join(base_dir, "preprocessing/metadata.json")

        if not os.path.exists(index_path):
            raise FileNotFoundError(f"FAISS-indeks ikke funnet: {index_path}")
        if not os.path.exists(metadata_path):
            raise FileNotFoundError(f"Metadata-fil ikke funnet: {metadata_path}")

        # Load faiss index
        self.index = faiss.read_index(index_path)

        # Load metadata
        with open(metadata_path, "r", encoding="utf-8") as f:
            self.metadata = json.load(f)

        # Load embedding model
        self.model = SentenceTransformer(model_name)

        end_load = time.time()
        print(f"✅ Modell og FAISS lastet på {end_load - start_load:.2f} sekunder")

    def get_relevant_laws(self, prompt: str, k: int = 10, min_words: int = 17) -> list[str]:
        """
        Returnerer relevante lovtekster som strenger basert på brukerens prompt.
        """
        if not prompt.strip():
            return []

        # Embed prompt
        query_vec = self.model.encode([prompt], convert_to_numpy=True)
        query_vec = query_vec / np.linalg.norm(query_vec, axis=1, keepdims=True)
        query_vec = query_vec.astype("float32")

        # FAISS-search
        D, I = self.index.search(query_vec, k)

        laws = []
        for idx in I[0]:
            doc = self.metadata[idx]
            text = doc.get("text", "").strip()
            if text and len(text.split()) >= min_words:
                laws.append(text)

        return laws