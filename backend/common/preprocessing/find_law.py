# import numpy as np
# import json
# import faiss
# from sentence_transformers import SentenceTransformer
# import time

# # --- LASTING AV DATA ÉN GANG ---
# start_time = time.time()

# # Last metadata og vektorer
# vectors = np.load("vectors.npy").astype("float16")  # sparer RAM
# with open("metadata.json", "r", encoding="utf-8") as f:
#     metadata = json.load(f)

# # Lag FAISS-indeks (cosine similarity via inner product på normaliserte vektorer)
# dim = vectors.shape[1]
# index = faiss.IndexFlatIP(dim)
# index.add(vectors)

# # Last inn embedding-modellen
# model = SentenceTransformer("all-MiniLM-L6-v2")

# loading_time = time.time() - start_time
# print(f"⏱️ Lasting av modell, FAISS og vektorer tok: {loading_time:.2f} sekunder\n")


# # --- FUNKSJON FOR Å SØKE LOVTEKST ---
# def finn_lovtekst(query, topp_n=3):
#     search_start = time.time()

#     # Embed spørringen
#     query_vec = model.encode([query], convert_to_numpy=True)
#     query_vec = query_vec / np.linalg.norm(query_vec, axis=1, keepdims=True)
#     query_vec = query_vec.astype("float16")  # matcher vektorene

#     # Søk i FAISS
#     scores, ids = index.search(query_vec, topp_n)

#     relevant_docs = []
#     for i, idx in enumerate(ids[0]):
#         doc = metadata[idx].copy()
#         doc["similarity_score"] = float(scores[0][i])
#         relevant_docs.append(doc)

#     # Vis resultater
#     for i, idx in enumerate(ids[0]):
#         doc = metadata[idx]
#         print(f"\n🔍 Treff #{i+1} (score: {scores[0][i]:.4f})")
#         print(f"Tittel: {doc['title']}")
#         print(f"Kapittel: {doc['chapter']}")
#         print(f"Tekst: {doc['text'][:500]}...")  # første 500 tegn

#     search_time = time.time() - search_start
#     print(f"\n⏱️ Søket tok: {search_time:.4f} sekunder")

#     return relevant_docs


# # --- EKSEMPEL PÅ BRUK ---
# if __name__ == "__main__":
#     query = "Annet ledd"
#     treff = finn_lovtekst(query, topp_n=3)
# import numpy as np
# import json
# import faiss
# from sentence_transformers import SentenceTransformer

# def finn_lovtekst(query, vectors_file="vectors.npy", metadata_file="metadata.json",
#                   embedding_model_name="all-MiniLM-L6-v2", topp_n=1):
#     # Last inn embeddings og metadata
#     vectors = np.load(vectors_file)
#     with open(metadata_file, "r", encoding="utf-8") as f:
#         metadata = json.load(f)

#     # Lag FAISS-indeks (bruker cosine similarity via inner product på normaliserte vektorer)
#     dim = vectors.shape[1]
#     index = faiss.IndexFlatIP(dim)
#     index.add(vectors)

#     # Embed spørringen
#     model = SentenceTransformer(embedding_model_name)
#     query_vec = model.encode([query], convert_to_numpy=True)
#     query_vec = query_vec / np.linalg.norm(query_vec, axis=1, keepdims=True)

#     # Søk etter mest lignende
#     scores, ids = index.search(query_vec, topp_n)

#     relevant_docs = []
#     for i, idx in enumerate(ids[0]):
#         doc = metadata[idx].copy()
#         doc["similarity_score"] = float(scores[0][i])  # legg til score for referanse
#         relevant_docs.append(doc)

#     # Vis resultat(er)
#     for i, idx in enumerate(ids[0]):
#         doc = metadata[idx]
#         print(f"\n🔍 Treff #{i+1} (score: {scores[0][i]:.4f})")
#         print(f"Tittel: {doc['title']}")
#         print(f"Kapittel: {doc['chapter']}")
#         print(f"Tekst: {doc['text'][:500]}...")  # Vis første 500 tegn

#     return relevant_docs

# # if __name__ == "__main__":
# #     tekst = input("Skriv inn en tekst du vil sammenligne med lovene:\n> ")
# #     finn_lovtekst(tekst)
# import time
# import numpy as np
# import faiss
# import json
# from sentence_transformers import SentenceTransformer

# # --- Timer start for lasting ---
# t0 = time.time()

# # Last inn FAISS-indeks
# index = faiss.read_index("laws.index")

# # Last inn metadata
# with open("metadata.json", "r", encoding="utf-8") as f:
#     metadata = json.load(f)

# # Last inn embed-modell (kun for spørring)
# model = SentenceTransformer("all-MiniLM-L6-v2")

# t1 = time.time()
# print(f"⏱️ Lasting av FAISS, metadata og modell tok: {t1-t0:.2f} sekunder")

# # --- Funksjon for søk ---
# def finn_lovtekst(query, topp_n=3):
#     # Embed spørringen
#     query_vec = model.encode([query], convert_to_numpy=True)
#     query_vec = query_vec / np.linalg.norm(query_vec, axis=1, keepdims=True)

#     # Søk
#     t_search_start = time.time()
#     scores, ids = index.search(query_vec, topp_n)
#     t_search_end = time.time()
#     print(f"⏱️ Søket tok: {t_search_end - t_search_start:.4f} sekunder")

#     # Hent relevante dokumenter
#     relevant_docs = []
#     for i, idx in enumerate(ids[0]):
#         doc = metadata[idx].copy()
#         doc["similarity_score"] = float(scores[0][i])
#         relevant_docs.append(doc)

#         # Print
#         print(f"\n🔍 Treff #{i+1} (score: {scores[0][i]:.4f})")
#         print(f"Tittel: {doc['title']}")
#         print(f"Kapittel: {doc['chapter']}")
#         print(f"Tekst: {doc['text'][:500]}...")

#     return relevant_docs

# # --- Eksempel på bruk ---
# query = "Annet ledd"
# finn_lovtekst(query)
import numpy as np
import time

# --- Globale variabler (settes når preload kjører) ---
FAISS_INDEX = None
METADATA = None
MODEL = None

def find_law(query, topp_n=3, index=None, metadata=None, model=None):
    """
    Søker i lovtekst ved hjelp av FAISS og sentence-transformers.
    
    Parametre:
    - query: str, brukerens spørring
    - topp_n: int, antall treff
    - index: FAISS Index (hvis allerede lastet)
    - metadata: metadata-liste (hvis allerede lastet)
    - model: SentenceTransformer-modell (hvis allerede lastet)
    """
    global FAISS_INDEX, METADATA, MODEL

    # Bruk preload-parametre hvis tilgjengelig
    if index is None:
        index = FAISS_INDEX
    if metadata is None:
        metadata = METADATA
    if model is None:
        model = MODEL

    if index is None or metadata is None or model is None:
        raise ValueError("FAISS, metadata og/eller modell er ikke lastet.")

    # --- Embed spørring ---
    query_vec = model.encode([query], convert_to_numpy=True)
    query_vec = query_vec / np.linalg.norm(query_vec, axis=1, keepdims=True)

    # --- Søk ---
    t0 = time.time()
    scores, ids = index.search(query_vec, topp_n)
    t1 = time.time()
    print(f"⏱️ Søket tok: {t1-t0:.4f} sekunder")

    # --- Hent relevante dokumenter ---
    relevant_docs = []
    for i, idx in enumerate(ids[0]):
        doc = metadata[idx].copy()
        doc["similarity_score"] = float(scores[0][i])
        relevant_docs.append(doc)

        # Print
        print(f"\n🔍 Treff #{i+1} (score: {scores[0][i]:.4f})")
        print(f"Tittel: {doc['title']}")
        print(f"Kapittel: {doc['chapter']}")
        print(f"Tekst: {doc['text'][:500]}...")

    return relevant_docs