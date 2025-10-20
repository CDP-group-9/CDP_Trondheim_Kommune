# import faiss
# import numpy as np
# import json

# # Last inn
# index = faiss.read_index("laws.index")
# vectors = np.load("vectors.npy")
# with open("metadata.json", "r", encoding="utf-8") as f:
#     metadata = json.load(f)

# # Lag en testspørring
# from sentence_transformers import SentenceTransformer
# model = SentenceTransformer("all-MiniLM-L6-v2")
# query = "Annet ledd"
# query_vec = model.encode([query], convert_to_numpy=True)
# query_vec = query_vec / np.linalg.norm(query_vec, axis=1, keepdims=True)

# # Søk
# D, I = index.search(query_vec, k=3)
# for i in I[0]:
#     print(f"\n🔎 Relevante dokument: {metadata[i]['titleShort']}")
#     print(metadata[i]['text'][:300], "...","...")
          
import faiss
import numpy as np
import json
from sentence_transformers import SentenceTransformer
import time

# --- Timer start for lasting ---
start_load = time.time()

# Last inn FAISS og metadata
index = faiss.read_index("laws.index")
with open("metadata.json", "r", encoding="utf-8") as f:
    metadata = json.load(f)

# Last modellen EN gang
model = SentenceTransformer("all-MiniLM-L6-v2")

end_load = time.time()
print(f"⏱️ Lasting av modell og FAISS tok: {end_load - start_load:.2f} sekunder")

# --- Søke-funksjon med timer ---
def søk_lov(query, k=3):
    start_search = time.time()

    # Embed spørring
    query_vec = model.encode([query], convert_to_numpy=True)
    query_vec = query_vec / np.linalg.norm(query_vec, axis=1, keepdims=True)
    query_vec = query_vec.astype("float32")  # FAISS bruker float32

    # FAISS-søk
    D, I = index.search(query_vec, k)

    end_search = time.time()
    print(f"⏱️ Søket tok: {end_search - start_search:.4f} sekunder")

    results = []
    for i in I[0]:
        doc = metadata[i]
        print(f"\n🔎 {doc['titleShort']} — {doc['chapter']}")
        print(doc['text'][:250], "...\n")
        results.append(doc)
    return results

# --- Eksempel ---
søk_lov("Annet ledd")
søk_lov("Oppsigelse")