import json
import logging
import os
import sys
import time

import psycopg2
import xmltodict
from fastembed import TextEmbedding
from tqdm import tqdm


# Konfigurer logging
logging.basicConfig(
    level=logging.INFO,  # Endre til DEBUG for mer detaljer
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),  # Log til konsollen
        logging.FileHandler("process_laws.log"),  # Log til fil
    ],
)

# --- GLOBAL MODELLCACHE ---
_model = None


def get_model():
    """Lazy-load modellen kun når den trengs."""
    global _model
    if _model is None:
        logging.info("🔹 Laster FastEmbed-modellen første gang...")
        # Using a similar sized model to all-MiniLM-L6-v2
        _model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
    return _model


# --------------------------
# Initialiser modellen én gang
# model = SentenceTransformer("all-MiniLM-L6-v2")

DB_CONFIG = {
    "dbname": "CDP_Trondheim_Kommune",
    "user": "CDP_Trondheim_Kommune",
    "password": "password",
    "host": "db",  # Hvis koden kjører på samme maskin
    "port": "5432",
}


# 1 Opprett database-tabell automatisk
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


# 2 Funksjon: XML → JSON
def xml_to_json(xml_path):
    with open(xml_path, encoding="utf-8") as f:
        xml_data = f.read()
    data = xmltodict.parse(xml_data)
    return data


# 3 Funksjon: trekk ut tekst (robust)
def extract_text_from_json(data):
    texts = []

    def walk(node):
        if isinstance(node, dict):
            for k, v in node.items():
                if k == "#text" and isinstance(v, str):
                    texts.append(v.strip())
                else:
                    walk(v)
        elif isinstance(node, list):
            for item in node:
                walk(item)

    try:
        walk(data)
        result = "\n".join(t for t in texts if t)
        if not result:
            logging.warning("Ingen tekst funnet i XML-strukturen.")
        return result
    except Exception as e:
        logging.error(f"Feil ved tekstuttrekk: {e}", exc_info=True)
        return None


# 4 Funksjon: lag embedding
def create_embedding(text):
    model = get_model()
    # FastEmbed returns a generator, so we need to get the first (and only) result
    embeddings = list(model.embed([text]))
    return embeddings[0].tolist()


# 5 Funksjon: lagre i PostgreSQL med try/catch
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


# 6 Funksjon: tøm tabellen
def clear_table(conn):
    with conn.cursor() as cur:
        cur.execute("TRUNCATE TABLE laws;")
    conn.commit()
    logging.info("🧹 Tabellen 'laws' er tømt.")


def process_laws(input_dir):
    conn = None

    #  Enkel retry for å vente på at DB er klar
    for attempt in range(5):
        try:
            conn = psycopg2.connect(**DB_CONFIG)
            logging.info("Koblet til databasen!")
            break
        except Exception as e:
            logging.warning(f"Kan ikke koble til databasen (forsøk {attempt+1}/5): {e}")
            time.sleep(3)  # Vent 3 sekunder før neste forsøk
    else:
        raise Exception("Kunne ikke koble til databasen etter flere forsøk")

    create_table_if_not_exists(conn)
    clear_table(conn)
    os.makedirs("json_output", exist_ok=True)

    for file in tqdm(os.listdir(input_dir), desc="Processing XML"):
        if file.endswith(".xml"):
            xml_path = os.path.join(input_dir, file)
            try:
                json_data = xml_to_json(xml_path)
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
