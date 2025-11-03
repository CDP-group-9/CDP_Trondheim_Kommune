import json
import logging
import os
import sys
import time

import psycopg2
from bs4 import BeautifulSoup
from fastembed import TextEmbedding
from tqdm import tqdm


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)

_model = None


def get_model():
    """Lazy-load modellen kun når den trengs."""
    global _model
    if _model is None:
        logging.info("🔹 Laster FastEmbed-modellen første gang...")
        _model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
    return _model


DB_CONFIG = {
    "dbname": "CDP_Trondheim_Kommune",
    "user": "CDP_Trondheim_Kommune",
    "password": "password",
    "host": "db",
    "port": "5432",
}


def create_table_if_not_exists(conn):
    with conn.cursor() as cur:
        cur.execute(
            """
            CREATE EXTENSION IF NOT EXISTS vector;

            -- Tabell for lover
            CREATE TABLE IF NOT EXISTS laws (
                id SERIAL PRIMARY KEY,
                law_id TEXT UNIQUE,
                text TEXT,
                metadata JSONB,
                embedding VECTOR(384)
            );

            -- Tabell for paragrafer relatert til lover
            CREATE TABLE IF NOT EXISTS paragraphs (
                id SERIAL PRIMARY KEY,
                paragraph_id TEXT,
                law_id TEXT,  -- peker til laws.law_id (men uten FK-begrensning)
                paragraph_number TEXT,
                text TEXT,
                metadata JSONB,
                embedding VECTOR(384)
            );
        """
        )
    conn.commit()
    logging.info("Tabellene 'laws' og 'paragraphs' er klare i databasen.")


def extract_text_from_json(data):
    """
    Slår sammen all tekst fra JSON til én streng for embedding.
    Fjerner duplikater og beholder rekkefølge.
    """
    parts = []

    if "Tittel" in data.get("metadata", {}):
        parts.append(data["metadata"]["Tittel"])

    for article in data.get("articles", []):
        for para in article.get("paragraphs", []):
            if para and para not in parts:
                parts.append(para)
    return "\n".join(parts)


def create_embedding(text):
    model = get_model()
    embeddings = list(model.embed([text]))
    return embeddings[0].tolist()


def insert_law_record(conn, law_id, text, metadata, embedding):
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO laws (law_id, text, metadata, embedding)
                VALUES (%s, %s, %s, %s)
            """,
                (law_id, text, json.dumps(metadata), embedding),
            )
        conn.commit()

    except Exception as e:
        logging.exception("Kunne ikke lagre lov %s: %s", law_id, e)


def insert_paragraph_record(
    conn, law_id, paragraph_id, paragraph_number, text, metadata, embedding
):
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO paragraphs (paragraph_id, law_id, paragraph_number, text, metadata, embedding)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (paragraph_id, law_id, paragraph_number, text, json.dumps(metadata), embedding),
            )
        conn.commit()

    except Exception as e:
        logging.exception("Kunne ikke lagre paragraf %s for lov %s: %s", paragraph_id, law_id, e)


def clear_table(conn):
    with conn.cursor() as cur:
        cur.execute("TRUNCATE TABLE paragraphs;")
        cur.execute("TRUNCATE TABLE laws;")
    conn.commit()
    logging.info("Tabellene 'laws' og 'paragraphs' er tømt.")


def process_laws(input_dir):
    conn = None

    for attempt in range(5):
        try:
            conn = psycopg2.connect(**DB_CONFIG)
            logging.info("Koblet til databasen!")
            break
        except Exception as e:
            logging.exception("Kan ikke koble til databasen (forsøk %s/5): %s", attempt + 1, e)
            time.sleep(3)
    else:
        raise Exception("Kunne ikke koble til databasen etter flere forsøk")

    create_table_if_not_exists(conn)
    clear_table(conn)

    def html_to_json_structured(html_path):
        """Konverter HTML/XML fra Lovdata til strukturert JSON med metadata, toc og artikler."""
        with open(html_path, encoding="utf-8") as f:
            soup = BeautifulSoup(f, "html.parser")

        metadata = {}
        for dt, dd in zip(
            soup.select("dl.data-document-key-info dt"),
            soup.select("dl.data-document-key-info dd"),
            strict=False,
        ):
            key = dt.get_text(strip=True)
            if dd.find("ul"):
                metadata[key] = [li.get_text(strip=True) for li in dd.select("li")]
            else:
                metadata[key] = dd.get_text(strip=True)

        def parse_toc(ul):
            items = []
            for li in ul.find_all("li", recursive=False):
                item = {"title": li.contents[0].strip()}
                sub_ul = li.find("ul")
                if sub_ul:
                    item["subsections"] = parse_toc(sub_ul)
                items.append(item)
            return items

        toc_ul = soup.select_one("dd.table-of-contents > ul.tocTopUl")
        table_of_contents = parse_toc(toc_ul) if toc_ul else []

        articles = []
        for legal_article in soup.select("article.legalArticle"):
            article_data = {
                "title": legal_article.get("data-name", ""),
                "url": legal_article.get("data-lovdata-url", ""),
                "paragraphs": [],
            }

            full_text = legal_article.get_text(" ", strip=True)
            if full_text:
                article_data["paragraphs"].append(full_text)

            articles.append(article_data)

        return {"metadata": metadata, "table_of_contents": table_of_contents, "articles": articles}

    for file in tqdm(os.listdir(input_dir), desc="Processing XML"):
        if not file.endswith(".xml"):
            continue

        xml_path = os.path.join(input_dir, file)
        law_id = os.path.splitext(file)[0]

        try:
            json_data = html_to_json_structured(xml_path)
        except (FileNotFoundError, UnicodeDecodeError, OSError) as e:
            logging.exception("Kunne ikke lese XML %s: %s", file, e)
            continue

        law_text = extract_text_from_json(json_data)
        if not law_text.strip():
            logging.warning("Ingen tekst funnet i %s", file)
            continue

        law_embedding = create_embedding(law_text)
        insert_law_record(conn, law_id, law_text, json_data["metadata"], law_embedding)

        # paragraph embeddings
        for idx, article in enumerate(json_data.get("articles", []), start=1):
            article_title = article.get("title") or f"§{idx}"

            for p_idx, paragraph_text in enumerate(article.get("paragraphs", []), start=1):
                if not paragraph_text.strip():
                    continue

                paragraph_id = f"{law_id}_p{idx}_{p_idx}"
                paragraph_embedding = create_embedding(paragraph_text)

                insert_paragraph_record(
                    conn=conn,
                    law_id=law_id,
                    paragraph_id=paragraph_id,
                    paragraph_number=article_title,
                    text=paragraph_text,
                    metadata={
                        "article_title": article.get("title"),
                        "paragraph_index": p_idx,
                    },
                    embedding=paragraph_embedding,
                )


if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    lovdata_path = os.path.join(current_dir, "lovdataxml")
    process_laws(lovdata_path)
