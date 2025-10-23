# import faiss
# import numpy as np
# import json
# from sentence_transformers import SentenceTransformer
# import time

# # --- Timer start for lasting ---
# start_load = time.time()

# # Last inn FAISS og metadata
# index = faiss.read_index("laws.index")
# with open("metadata.json", "r", encoding="utf-8") as f:
#     metadata = json.load(f)

# # Last modellen EN gang
# model = SentenceTransformer("all-MiniLM-L6-v2")

# end_load = time.time()
# print(f"⏱️ Lasting av modell og FAISS tok: {end_load - start_load:.2f} sekunder")

# # --- Søke-funksjon med timer ---
# def søk_lov(query, k=3):
#     start_search = time.time()

#     # Embed spørring
#     query_vec = model.encode([query], convert_to_numpy=True)
#     query_vec = query_vec / np.linalg.norm(query_vec, axis=1, keepdims=True)
#     query_vec = query_vec.astype("float32")  # FAISS bruker float32

#     # FAISS-søk
#     D, I = index.search(query_vec, k)

#     end_search = time.time()
#     print(f"⏱️ Søket tok: {end_search - start_search:.4f} sekunder")

#     results = []
#     for i in I[0]:
#         doc = metadata[i]
#         print(f"\n🔎 {doc['titleShort']} — {doc['chapter']}")
#         print(doc['text'][:250], "...\n")
#         results.append(doc)
#     return results

# # --- Eksempel ---
# søk_lov("Personvern")
# søk_lov("DPIA")
# søk_lov("GDPR")
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

# --- Søke-funksjon med lagring til txt ---
def søk_lov(query, k=3, filnavn="søk_resultater.txt"):
    start_search = time.time()

    # Embed spørring
    query_vec = model.encode([query], convert_to_numpy=True)
    query_vec = query_vec / np.linalg.norm(query_vec, axis=1, keepdims=True)
    query_vec = query_vec.astype("float32")  # FAISS bruker float32

    # FAISS-søk
    D, I = index.search(query_vec, k)  # D = similarity score, I = indeks

    end_search = time.time()
    søketid = end_search - start_search
    print(f"⏱️ Søket tok: {søketid:.4f} sekunder")

    results = []
    
    # --- Skriv til fil ---
    with open(filnavn, "a", encoding="utf-8") as f:
        print(f"⏱️ Lasting av modell og FAISS tok: {end_load - start_load:.2f} sekunder")
        f.write(f"\n===== Søkeresultater for: '{query}' =====\n")
        f.write(f"⏱️ Søket tok: {søketid:.4f} sekunder\n\n")
        
        for idx, i in enumerate(I[0]):
            doc = metadata[i]
            score = D[0][idx]  # similarity score
            
            # Print til konsoll
            print(f"\n🔎 {doc['titleShort']} — {doc['chapter']}")
            print(f"Similarity score: {score:.4f}")
            print(doc['text'][:2500], "...\n")
            
            # Skriv til fil
            f.write(f"🔎 {doc['titleShort']} — {doc['chapter']}\n")
            f.write(f"Similarity score: {score:.4f}\n")
            f.write(doc['text'][:10000] + "...\n\n")  # lagre opptil 1000 tegn per tekst
            
            results.append({"doc": doc, "score": score})
    
    return results


# --- Eksempler ---
søk_lov("Personvern datatilsynet internkontroll")
søk_lov("rett til innsyn databehandler")
søk_lov("den registrerte formål retting og sletting")
søk_lov("student retningslinjer reservert studieplass")