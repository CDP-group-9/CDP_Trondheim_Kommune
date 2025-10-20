# import json
# from pathlib import Path
# from sentence_transformers import SentenceTransformer, models
# import faiss
# import numpy as np

# def extract_text(art):
#     """Henter all tekst fra et 'article'-objekt, inkludert nested ul/li/article."""
#     if "#text" in art and art["#text"].strip():
#         return art["#text"].strip()

#     texts = []

#     if "p" in art:
#         p = art["p"]
#         if isinstance(p, dict) and "#text" in p:
#             texts.append(p["#text"].strip())

#     if "ul" in art:
#         ul = art["ul"]
#         if isinstance(ul.get("li"), list):
#             for li in ul["li"]:
#                 if isinstance(li, str):
#                     texts.append(li.strip())
#                 elif isinstance(li, dict):
#                     if "article" in li:
#                         texts.append(extract_text(li["article"]))
#                     elif "#text" in li:
#                         texts.append(li["#text"].strip())
#         elif isinstance(ul.get("li"), dict):
#             li = ul["li"]
#             if "article" in li:
#                 texts.append(extract_text(li["article"]))
#             elif "#text" in li:
#                 texts.append(li["#text"].strip())

#     return " ".join(texts).strip()


# def load_laws(json_folder):
#     """Laster alle lovfiler fra en mappe og returnerer liste over dokumenter."""
#     documents = []

#     for file in Path(json_folder).glob("*.json"):
#         with open(file, "r", encoding="utf-8") as f:
#             data = json.load(f)

#         try:
#             header_dd = data["html"]["body"]["header"]["dl"]["dd"]
#             dokid = header_dd[2]["#text"]
#             title = header_dd[9]["#text"]
#         except (KeyError, IndexError):
#             continue

#         main_body = data["html"]["body"]["main"]
#         sections = main_body.get("section", [])
#         if isinstance(sections, dict):
#             sections = [sections]

#         for sec in sections:
#             chap_id = sec.get("@data-name", "unknown")
#             articles = sec.get("article", [])
#             if isinstance(articles, dict):
#                 articles = [articles]

#             for art in articles:
#                 text = extract_text(art)
#                 if text:
#                     documents.append({
#                         "dokid": dokid,
#                         "title": title,
#                         "chapter": chap_id,
#                         "text": text
#                     })
#     return documents


# def chunk_text(text, tokenizer, max_tokens=300):
#     """Deler opp tekst i mindre biter basert på token-lengde."""
#     tokens = tokenizer.tokenize(text)
#     chunks = []
#     for i in range(0, len(tokens), max_tokens):
#         chunk_tokens = tokens[i:i + max_tokens]
#         chunk_text = tokenizer.convert_tokens_to_string(chunk_tokens)
#         chunks.append(chunk_text)
#     return chunks
# # def extract_text(art):
# #     """
# #     Henter teksten fra et 'article'-objekt, inkl. nested p, ul, li.
# #     """
# #     text = art.get("#text", "")
# #     if text:
# #         return text.strip()

# #     # Fallbacks for nested strukturer
# #     for key in ["p", "ul", "li"]:
# #         nested = art.get(key)
# #         if not nested:
# #             continue

# #         if isinstance(nested, dict):
# #             text = nested.get("#text", "")
# #             if text:
# #                 return text.strip()
# #         elif isinstance(nested, list):
# #             texts = []
# #             for n in nested:
# #                 if isinstance(n, dict):
# #                     t = n.get("#text", "")
# #                     if t:
# #                         texts.append(t.strip())
# #             if texts:
# #                 return " ".join(texts)
# #     return ""

# # def load_laws(json_folder):
# #     documents = []

# #     for file in Path(json_folder).glob("*.json"):
# #         with open(file, "r", encoding="utf-8") as f:
# #             data = json.load(f)

# #         try:
# #             header_dd = data["html"]["body"]["header"]["dl"]["dd"]
# #             dokid = header_dd[2]["#text"]
# #             title = header_dd[9]["#text"]
# #         except (KeyError, IndexError):
# #             continue

# #         main_body = data["html"]["body"]["main"]
# #         sections = main_body.get("section", [])
# #         if not sections:
# #             continue

# #         if isinstance(sections, dict):
# #             sections = [sections]

# #         for sec in sections:
# #             chap_id = sec.get("@data-name", "unknown")
# #             articles = sec.get("article", [])
# #             if isinstance(articles, dict):
# #                 articles = [articles]

# #             for art in articles:
# #                 text = extract_text(art)
# #                 if text:
# #                     documents.append({
# #                         "dokid": dokid,
# #                         "title": title,
# #                         "chapter": chap_id,
# #                         "text": text
# #                     })

# #     return documents


# # class LawRetriever:
# #     """
# #     Holder dokumenter, embedding-modell og FAISS-index,
# #     og gjør det mulig å søke effektivt.
# #     """
# #     def __init__(self, json_folder="lovdata_test", embedding_model_name="all-MiniLM-L6-v2"):
# #         self.documents = load_laws(json_folder)
# #         if not self.documents:
# #             print("⚠️ Ingen dokumenter funnet!")
# #             self.index = None
# #             self.embedding_model = None
# #             return

# #         self.embedding_model = SentenceTransformer(embedding_model_name)
# #         tokenizer = self.embedding_model.tokenizer 
# #         texts = [doc["text"] for doc in self.documents]
# #         for i, text in enumerate(texts[:5]):  # printer kun de første 5 for oversikt
# #             tokens = tokenizer.tokenize(text)
# #             print(f"Document {i} - {len(tokens)} tokens")
# #             print(tokens[:50], "...")  # vis de første 50 tokenene
            
# #         vectors = self.embedding_model.encode(texts, convert_to_numpy=True, show_progress_bar=True)

# #         embedding_dim = vectors.shape[1]
# #         self.index = faiss.IndexFlatL2(embedding_dim)
# #         self.index.add(vectors)
# #         print(f"FAISS index created with {self.index.ntotal} vectors.")

# #     def query(self, query_text, top_k=5):
# #         if not self.documents or not self.index:
# #             print("⚠️ Ingen dokumenter eller index tilgjengelig.")
# #             return []

# #         q_vector = self.embedding_model.encode([query_text], convert_to_numpy=True)
# #         distances, indices = self.index.search(q_vector, top_k)
# #         results = [self.documents[i] for i in indices[0]]
# #         return results

# # # --- Test ---
# # if __name__ == "__main__":
# #     retriever = LawRetriever(json_folder="lovdata_test")
# #     if retriever.documents:
# #         results = retriever.query("hunder hjemme", top_k=5)
# #         for r in results:
# #             print(f"{r['title']} ({r['chapter']}): {r['text'][:100]}...")

# class LawRetriever:
#     """
#     RAG-ready klasse for lovdata.
#     Laster dokumenter, chunker, lager embeddings, og muliggjør søk i FAISS.
#     """

#     def __init__(self, json_folder="lovdata_test", embedding_model_name="all-MiniLM-L6-v2", max_tokens=300):
#         print("🔍 Initialiserer LawRetriever...")

#         self.documents = load_laws(json_folder)
#         if not self.documents:
#             print("⚠️ Ingen dokumenter funnet!")
#             self.index = None
#             self.embedding_model = None
#             return

#         self.embedding_model = SentenceTransformer(embedding_model_name)
#         self.tokenizer = self.embedding_model.tokenizer
#         self.max_tokens = max_tokens

#         # Chunk dokumentene og bygg metadata
#         self.chunks = []
#         self.metadata = []
#         for doc in self.documents:
#             doc_chunks = chunk_text(doc["text"], self.tokenizer, max_tokens)
#             for chunk in doc_chunks:
#                 self.chunks.append(chunk)
#                 self.metadata.append({
#                     "dokid": doc["dokid"],
#                     "title": doc["title"],
#                     "chapter": doc["chapter"],
#                     "text": chunk
#                 })

#         # Lag embeddings
#         print(f"📚 Lager embeddings for {len(self.chunks)} tekstbiter...")
#         vectors = self.embedding_model.encode(self.chunks, convert_to_numpy=True, show_progress_bar=True)
#         embedding_dim = vectors.shape[1]

#         # Bygg FAISS-index
#         self.index = faiss.IndexFlatL2(embedding_dim)
#         self.index.add(vectors)
#         print(f"✅ FAISS index opprettet med {self.index.ntotal} vektorer.")

#     def query(self, query_text, top_k=5):
#         """Returnerer de mest relevante tekstbitene for et søk."""
#         if not self.index or not self.metadata:
#             print("⚠️ Ingen dokumenter eller index tilgjengelig.")
#             return []

#         q_vector = self.embedding_model.encode([query_text], convert_to_numpy=True)
#         distances, indices = self.index.search(q_vector, top_k)
#         results = [self.metadata[i] for i in indices[0]]

#         print(f"🔎 Fant {len(results)} relevante treff.")
#         return results