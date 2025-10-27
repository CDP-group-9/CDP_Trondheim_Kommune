import json
import logging
import os
import sys
import time

import psycopg2
from fastembed import TextEmbedding
from tqdm import tqdm
from bs4 import BeautifulSoup


logging.basicConfig(
    level=logging.INFO,  
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),  
        logging.FileHandler("process_laws.log"),  
    ],
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
            CREATE TABLE IF NOT EXISTS laws (
                id SERIAL PRIMARY KEY,
                law_id TEXT,
                text TEXT,
                metadata JSONB,
                embedding VECTOR(384)
            );
        """
        )
    conn.commit()
    logging.info(" Tabell 'laws' er klar i databasen.")


def html_to_json(html_path):
    with open(html_path, encoding="utf-8") as f:
        soup = BeautifulSoup(f, "html.parser")

    header = soup.find("header", class_="documentHeader")
    main = soup.find("main", class_="documentBody")

    data = {
        "title": (header.find("dd", class_="title").text.strip()
                  if header.find("dd", class_="title") else None),
        "ministry": (header.find("dd", class_="ministry").text.strip()
                     if header.find("dd", class_="ministry") else None),
        "date_in_force": (header.find("dd", class_="dateInForce").text.strip()
                          if header.find("dd", class_="dateInForce") else None),
        "published": (header.find("dd", class_="dateOfPublication").text.strip()
                      if header.find("dd", class_="dateOfPublication") else None),
        "based_on": [li.text.strip() for li in header.select("dd.basedOn li")],
        "changes_to": [li.text.strip() for li in header.select("dd.changesToDocuments li")],
        "chapters": [],
    }

    for section in main.find_all("section", class_="section"):
        chapter = {
            "name": section.find("h2").text.strip() if section.find("h2") else None,
            "articles": [],
        }
        for article in section.find_all("article"):
            text = article.get_text(" ", strip=True)
            title = None
            para = article.find(class_="legalArticleTitle")
            if para:
                title = para.text.strip()
            article_id = article.get("id")
            chapter["articles"].append({
                "id": article_id,
                "title": title,
                "text": text,
            })
        data["chapters"].append(chapter)

    return data

def extract_text_from_json(data):
    parts = [data.get("title", "")]
    for chapter in data.get("chapters", []):
        for article in chapter["articles"]:
            if article.get("text"):
                parts.append(article["text"])
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
        logging.info(f"Lagret lov: {law_id}")
    except Exception as e:
        logging.error(f"Kunne ikke lagre lov {law_id}: {e}", exc_info=True)


def clear_table(conn):
    with conn.cursor() as cur:
        cur.execute("TRUNCATE TABLE laws;")
    conn.commit()
    logging.info("🧹 Tabellen 'laws' er tømt.")


def process_laws(input_dir):
    conn = None

    for attempt in range(5):
        try:
            conn = psycopg2.connect(**DB_CONFIG)
            logging.info("Koblet til databasen!")
            break
        except Exception as e:
            logging.warning(f"Kan ikke koble til databasen (forsøk {attempt+1}/5): {e}")
            time.sleep(3)  
    else:
        raise Exception("Kunne ikke koble til databasen etter flere forsøk")

    create_table_if_not_exists(conn)
    clear_table(conn)
    os.makedirs("json_output", exist_ok=True)

    for file in tqdm(os.listdir(input_dir), desc="Processing XML"):
        if file.endswith(".xml"):
            xml_path = os.path.join(input_dir, file)
            try:
                json_data = html_to_json(xml_path)
            except Exception as e:
                logging.error(f"Kunne ikke lese XML {file}: {e}", exc_info=True)
                continue

            text = extract_text_from_json(json_data)
            if not text:
                logging.warning(f"Ingen tekst funnet i {file}")
                continue

            embedding = create_embedding(text)
            law_id = os.path.splitext(file)[0]

            insert_law_record(conn, law_id, text, json_data, embedding)

    conn.close()
    logging.info("Ferdig med konvertering og lagring!")


if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    lovdata_path = os.path.join(current_dir, "lovdataxml")
    process_laws(lovdata_path)
