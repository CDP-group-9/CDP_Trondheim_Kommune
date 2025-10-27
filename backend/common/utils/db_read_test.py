import psycopg2
import psycopg2.extras
import numpy as np
import ast

# ========================
# Konfigurasjon av DB
# ========================
DB_CONFIG = {
    "dbname": "CDP_Trondheim_Kommune",
    "user": "CDP_Trondheim_Kommune",
    "password": "password",
    "host": "db",  # Endre til 'db' hvis du kjører i Docker
    "port": "5432"        # Endre til riktig port som er mappet til host
}

OUTPUT_FILE = "laws_embeddings.txt"


def fetch_embeddings(limit=None):
    """Henter law_id og embedding fra DB"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        query = "SELECT law_id, embedding, metadata FROM laws"
        if limit:
            query += f" LIMIT {limit}"
        cursor.execute(query)

        results = cursor.fetchall()
        return results

    except Exception as e:
        print(" Feil ved henting av data:", e)
        return []

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

def save_embeddings_to_txt(data, filename):
    """Lagrer embeddings til txt-fil i format: law_id<TAB>v1,v2,v3,..."""
    with open(filename, "w", encoding="utf-8") as f:
        for row in data:
            law_id = row["law_id"]
            embedding = row["embedding"]
            text = row["metadata"]

            # Hvis embedding kommer som tekst, konverter til liste
            if isinstance(embedding, str):
                try:
                    embedding = ast.literal_eval(embedding)  # tryggere enn eval
                except Exception as e:
                    print(f"Feil ved parsing av embedding for {law_id}: {e}")
                    continue

            # Hvis embedding er numpy array, konverter til liste
            if isinstance(embedding, np.ndarray):
                embedding = embedding.tolist()

            # Lag en ren kommaseparert streng
            embedding_str = ",".join(str(x) for x in embedding)

            # Skriv til fil
            f.write(f"{law_id}\t{embedding_str}\t{text}\n")

    print(f" Lagret {len(data)} embeddings til {filename}")

if __name__ == "__main__":
    # Hent for eksempel 10 embeddings
    embeddings_data = fetch_embeddings(limit=2)
    save_embeddings_to_txt(embeddings_data, OUTPUT_FILE)