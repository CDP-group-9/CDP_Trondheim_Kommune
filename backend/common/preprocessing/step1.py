import json
from pathlib import Path
from sentence_transformers import SentenceTransformer
import numpy as np
import faiss

def extract_text(art):
    """Retrieves the text from an 'article' object, including nested p, ul, li."""
    text = art.get("#text", "")
    if text:
        return text.strip()

    for key in ["p", "ul", "li"]:
        nested = art.get(key)
        if not nested:
            continue

        if isinstance(nested, dict):
            t = nested.get("#text", "")
            if t:
                return t.strip()
        elif isinstance(nested, list):
            texts = []
            for n in nested:
                if isinstance(n, dict):
                    t = n.get("#text", "")
                    if t:
                        texts.append(t.strip())
            if texts:
                return " ".join(texts)
    return ""


def parse_header_dd(header_dd):
    """Retrieves all metadata from the header dd list."""
    metadata_map = {}
    for item in header_dd:
        key = item.get("@class")
        if not key:
            continue
        value = ""
        if "#text" in item:
            value = item["#text"]
        elif "ul" in item:
            ul = item["ul"]
            if isinstance(ul, dict) and "li" in ul:
                li = ul["li"]
                if isinstance(li, list):
                    value = " | ".join([l if isinstance(l, str) else str(l) for l in li])
                elif isinstance(li, dict) and "#text" in li:
                    value = li["#text"]
                elif isinstance(li, str):
                    value = li
        metadata_map[key] = value
    return metadata_map


def load_and_embed_laws(json_folder, embedding_model_name="all-MiniLM-L6-v2",
                        metadata_file="metadata.json", vectors_file="vectors.npy"):
    """Loads JSON files, creates embeddings, and saves metadata and embeddings to disk."""
    documents = []

    for file in Path(json_folder).glob("*.json"):
        with open(file, "r", encoding="utf-8") as f:
            data = json.load(f)
        try:
            header_dd = data["html"]["body"]["header"]["dl"]["dd"]
            metadata_map = parse_header_dd(header_dd)
        except (KeyError, IndexError):
            continue

        main_body = data["html"]["body"]["main"]
        sections = main_body.get("section", [])
        if not sections:
            continue
        if isinstance(sections, dict):
            sections = [sections]

        for sec in sections:
            chap_id = sec.get("@data-name", "unknown")
            articles = sec.get("article", [])
            if isinstance(articles, dict):
                articles = [articles]

            for art in articles:
                text = extract_text(art)
                if text:
                    doc = {
                        "dokid": metadata_map.get("dokid", ""),
                        "title": metadata_map.get("title", ""),
                        "titleShort": metadata_map.get("titleShort", ""),
                        "ministry": metadata_map.get("ministry", ""),
                        "publishedIn": metadata_map.get("publishedIn", ""),
                        "dateInForce": metadata_map.get("dateInForce", ""),
                        "dateOfPublication": metadata_map.get("dateOfPublication", ""),
                        "changesToDocuments": metadata_map.get("changesToDocuments", ""),
                        "miscInformation": metadata_map.get("miscInformation", ""),
                        "tableOfContents": metadata_map.get("table-of-contents", ""),
                        "chapter": chap_id,
                        "text": text
                    }
                    documents.append(doc)

    if not documents:
        print("No documents found.")
        return

    # --- Embeddings ---
    model = SentenceTransformer(embedding_model_name)
    texts = [doc["text"] for doc in documents]
    vectors = model.encode(texts, convert_to_numpy=True, show_progress_bar=True)

    # Normalize for cosine similarity
    vectors = vectors / np.linalg.norm(vectors, axis=1, keepdims=True)

    vectors = vectors.astype("float16")

    # Store
    np.save(vectors_file, vectors)
    with open(metadata_file, "w", encoding="utf-8") as f:
        json.dump(documents, f, ensure_ascii=False, indent=2)

    print(f"Stored {len(documents)} documents and embeddings.")

    # index = faiss.IndexFlatL2(vectors.shape[1])
    index = faiss.IndexFlatIP(vectors.shape[1])
    index.add(vectors)
    faiss.write_index(index, "laws.index")
    print("Faiss-index stored as laws.index")
    return documents


if __name__ == "__main__":
    documents = load_and_embed_laws("../lovdata_test")
    if not documents:
        exit()