import json
import logging
import os
import sys
import time

import psycopg2
from bs4 import BeautifulSoup
from fastembed import TextEmbedding
from law_extractor import fetch_lovdata_laws, standard_format_laws

# Configure logging to print to console
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)

_model = None 

# Lazy loading only when model is needed
def get_model():
    global _model
    if _model is None:
        _model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
    return _model


# Database connection 
DB_CONFIG = {
    "dbname": "CDP_Trondheim_Kommune",
    "user": "CDP_Trondheim_Kommune",
    "password": "password",
    "host": "db",
    "port": "5432",
}

# Create necessary tables if they do not exist
def create_table_if_not_exists(conn):
    with conn.cursor() as cur:
        cur.execute(
            """
            CREATE EXTENSION IF NOT EXISTS vector;

            -- Table for laws
            CREATE TABLE IF NOT EXISTS laws (
                id SERIAL PRIMARY KEY,
                law_id TEXT UNIQUE,
                text TEXT,
                metadata JSONB,
                embedding VECTOR(384)
            );

            -- Table for paragraphs related to laws
            CREATE TABLE IF NOT EXISTS paragraphs (
                id SERIAL PRIMARY KEY,
                paragraph_id TEXT,
                law_id TEXT,  -- points to laws.law_id (but without FK-constraints)
                paragraph_number TEXT,
                text TEXT,
                metadata JSONB,
                embedding VECTOR(384)
            );
        """
        )
    conn.commit()

# Extract all text from JSON into a single string
def extract_text_from_json(data):
    parts = []

    if "Tittel" in data.get("metadata", {}):
        parts.append(data["metadata"]["Tittel"])

    for article in data.get("articles", []):
        for para in article.get("paragraphs", []):
            if para and para not in parts:
                parts.append(para)
    return "\n".join(parts)


# Create embedding for given text with model
def create_embedding(text):
    model = get_model()
    embeddings = list(model.embed([text]))
    return embeddings[0].tolist()


# Insert a law into the database
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
        logging.exception("Could not store law %s: %s", law_id, e)


# Insert a paragraph into the database
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
        logging.exception("Could not store paragraph %s for law %s: %s", paragraph_id, law_id, e)


# Clear all data from tables
def clear_table(conn):
    with conn.cursor() as cur:
        cur.execute("TRUNCATE TABLE paragraphs;")
        cur.execute("TRUNCATE TABLE laws;")
    conn.commit()


# Main function to process laws and store in database
def process_laws(input_dir):
    conn = None

    # Try to connect to the database with retries
    for attempt in range(5):
        try:
            conn = psycopg2.connect(**DB_CONFIG)
            logging.info("Connected to database!")
            break
        except Exception as e:
            logging.exception("Could not connect to database (attemp %s/5): %s", attempt + 1, e)
            time.sleep(3)
    else:
        raise Exception("Could not connect to database after several attempts")

    # Create tables and clear existing data
    create_table_if_not_exists(conn)
    clear_table(conn)

    def html_to_json_structured(html_path):
        with open(html_path, encoding="utf-8") as f:
            soup = BeautifulSoup(f, "html.parser")

        # Extract metadata
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

        # Parse table of content recursively
        def parse_toc(ul):
            items = []
            for li in ul.find_all("li", recursive=False):
                parts = []
                for child in li.contents:
                    if getattr(child, "name", None) == "ul":
                        continue
                    if hasattr(child, "get_text"):
                        parts.append(child.get_text(strip=True))
                    else:
                        parts.append(str(child).strip())
                title_text = " ".join(parts).strip()
                item = {"title": title_text}
                sub_ul = li.find("ul", recursive=False)
                if sub_ul:
                    item["subsections"] = parse_toc(sub_ul)
                items.append(item)
            return items

        toc_ul = soup.select_one("dd.table-of-contents > ul")
        table_of_contents = parse_toc(toc_ul) if toc_ul else []

        # Extract articles and paragraphs texts
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

    # Process each XML file in the input directory
    for file in os.listdir(input_dir):
        if not file.endswith(".xml"):
            continue

        xml_path = os.path.join(input_dir, file)
        law_id = os.path.splitext(file)[0]

        try:
            json_data = html_to_json_structured(xml_path)
        except (FileNotFoundError, UnicodeDecodeError, OSError) as e:
            logging.exception("Could not read XML %s: %s", file, e)
            continue

        # Extract text and create embedding
        law_text = extract_text_from_json(json_data)
        if not law_text.strip():
            logging.warning("No text found in %s", file)
            continue

        law_embedding = create_embedding(law_text)
        insert_law_record(conn, law_id, law_text, json_data["metadata"], law_embedding)

        paragraph_count = 0

        # Process each paragraph and generate embeddings
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
                paragraph_count += 1
                
        print(f" Added {paragraph_count} paragraphs from {law_id}")
        os.remove(xml_path)


# Main program execution
if __name__ == "__main__":
    law_dir = "common/utils/lovdataxml"
    fetch_lovdata_laws(standard_format_laws, out_dir=law_dir)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    process_laws(law_dir)
