"""Unit and integration tests for db_client utility functions.

Unit tests mock external dependencies (TextEmbedding model) to test individual functions.
Integration tests use the Django test database to test actual PostgreSQL operations.
"""

from unittest.mock import MagicMock, patch

from django.conf import settings
from django.test import TestCase

import psycopg2

from common.utils.db_client import (
    clear_table,
    create_embedding,
    create_table_if_not_exists,
    extract_text_from_json,
    get_model,
    insert_law_record,
    insert_paragraph_record,
)


class GetModelTest(TestCase):
    """Test the lazy loading model singleton."""

    @patch("common.utils.db_client.TextEmbedding")
    def test_get_model_initializes_once(self, mock_embedding_class):
        """Test that model is only initialized once"""
        import common.utils.db_client as db_client

        db_client._model = None

        mock_model = MagicMock()
        mock_embedding_class.return_value = mock_model

        model1 = get_model()
        model2 = get_model()

        self.assertEqual(model1, model2)
        mock_embedding_class.assert_called_once_with(model_name="BAAI/bge-small-en-v1.5")


class ExtractTextFromJsonTest(TestCase):
    """Test extracting text from law JSON data."""

    def test_extract_text_with_title_and_paragraphs(self):
        """Test extracting text from complete JSON data"""
        data = {
            "metadata": {"Tittel": "Test Law Title"},
            "articles": [
                {"paragraphs": ["Paragraph 1", "Paragraph 2"]},
                {"paragraphs": ["Paragraph 3"]},
            ],
        }

        result = extract_text_from_json(data)

        self.assertIn("Test Law Title", result)
        self.assertIn("Paragraph 1", result)
        self.assertIn("Paragraph 2", result)
        self.assertIn("Paragraph 3", result)

    def test_extract_text_without_title(self):
        """Test extracting text when title is missing"""
        data = {
            "metadata": {},
            "articles": [{"paragraphs": ["Paragraph 1"]}],
        }

        result = extract_text_from_json(data)

        self.assertNotIn("Tittel", result)
        self.assertIn("Paragraph 1", result)

    def test_extract_text_removes_duplicates(self):
        """Test that duplicate paragraphs are not repeated"""
        data = {
            "metadata": {"Tittel": "Title"},
            "articles": [
                {"paragraphs": ["Same text", "Same text", "Different text"]},
            ],
        }

        result = extract_text_from_json(data)

        occurrences = result.count("Same text")
        self.assertEqual(occurrences, 1)

    def test_extract_text_empty_data(self):
        """Test extracting text from empty data"""
        data = {"metadata": {}, "articles": []}

        result = extract_text_from_json(data)

        self.assertEqual(result, "")


class CreateEmbeddingTest(TestCase):
    """Test creating embeddings from text."""

    @patch("common.utils.db_client.get_model")
    def test_create_embedding_returns_list(self, mock_get_model):
        """Test that create_embedding returns a list"""
        mock_model = MagicMock()
        mock_array = MagicMock()
        mock_array.tolist.return_value = [0.1] * 384
        mock_model.embed.return_value = iter([mock_array])
        mock_get_model.return_value = mock_model

        result = create_embedding("test text")

        self.assertIsInstance(result, list)
        self.assertEqual(len(result), 384)
        mock_model.embed.assert_called_once_with(["test text"])

    @patch("common.utils.db_client.get_model")
    def test_create_embedding_with_empty_text(self, mock_get_model):
        """Test creating embedding with empty text"""
        mock_model = MagicMock()
        mock_array = MagicMock()
        mock_array.tolist.return_value = [0.0] * 384
        mock_model.embed.return_value = iter([mock_array])
        mock_get_model.return_value = mock_model

        result = create_embedding("")

        self.assertIsInstance(result, list)
        mock_model.embed.assert_called_once_with([""])


class DatabaseIntegrationTest(TestCase):
    """Integration tests for database operations using Django test database."""

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        db_settings = settings.DATABASES["default"]
        cls.db_config = {
            "dbname": db_settings["NAME"],
            "user": db_settings["USER"],
            "password": db_settings["PASSWORD"],
            "host": db_settings["HOST"],
            "port": db_settings["PORT"],
        }

    def setUp(self):
        """Create a fresh database connection for each test"""
        self.conn = psycopg2.connect(**self.db_config)
        create_table_if_not_exists(self.conn)

    def tearDown(self):
        """Close database connection after each test"""
        if self.conn:
            self.conn.close()

    def test_create_table_if_not_exists(self):
        """Test that tables are created successfully"""
        with self.conn.cursor() as cur:
            cur.execute(
                """
                SELECT EXISTS (
                    SELECT FROM information_schema.tables
                    WHERE table_name = 'laws'
                );
            """
            )
            laws_exists = cur.fetchone()[0]

            cur.execute(
                """
                SELECT EXISTS (
                    SELECT FROM information_schema.tables
                    WHERE table_name = 'paragraphs'
                );
            """
            )
            paragraphs_exists = cur.fetchone()[0]

            cur.execute(
                """
                SELECT EXISTS (
                    SELECT FROM pg_extension
                    WHERE extname = 'vector'
                );
            """
            )
            vector_exists = cur.fetchone()[0]

        self.assertTrue(laws_exists)
        self.assertTrue(paragraphs_exists)
        self.assertTrue(vector_exists)

    def test_insert_law_record(self):
        """Test inserting a law record into the database"""
        clear_table(self.conn)

        law_id = "test-law-001"
        text = "This is a test law text."
        metadata = {"title": "Test Law", "year": "2024"}
        embedding = [0.1] * 384

        insert_law_record(self.conn, law_id, text, metadata, embedding)

        with self.conn.cursor() as cur:
            cur.execute("SELECT law_id, text, metadata FROM laws WHERE law_id = %s", (law_id,))
            result = cur.fetchone()

        self.assertIsNotNone(result)
        self.assertEqual(result[0], law_id)
        self.assertEqual(result[1], text)
        self.assertEqual(result[2]["title"], "Test Law")

    def test_insert_paragraph_record(self):
        """Test inserting a paragraph record into the database"""
        clear_table(self.conn)

        law_id = "test-law-002"
        insert_law_record(self.conn, law_id, "Law text", {}, [0.1] * 384)

        paragraph_id = "test-para-001"
        paragraph_number = "§ 1"
        text = "This is paragraph text."
        metadata = {"section": "1"}
        embedding = [0.2] * 384

        insert_paragraph_record(
            self.conn, law_id, paragraph_id, paragraph_number, text, metadata, embedding
        )

        with self.conn.cursor() as cur:
            cur.execute(
                "SELECT paragraph_id, law_id, paragraph_number, text FROM paragraphs WHERE paragraph_id = %s",
                (paragraph_id,),
            )
            result = cur.fetchone()

        self.assertIsNotNone(result)
        self.assertEqual(result[0], paragraph_id)
        self.assertEqual(result[1], law_id)
        self.assertEqual(result[2], paragraph_number)
        self.assertEqual(result[3], text)

    def test_clear_table(self):
        """Test clearing all records from tables"""
        insert_law_record(self.conn, "law-1", "Text 1", {}, [0.1] * 384)
        insert_law_record(self.conn, "law-2", "Text 2", {}, [0.2] * 384)

        clear_table(self.conn)

        with self.conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM laws")
            laws_count = cur.fetchone()[0]

            cur.execute("SELECT COUNT(*) FROM paragraphs")
            paragraphs_count = cur.fetchone()[0]

        self.assertEqual(laws_count, 0)
        self.assertEqual(paragraphs_count, 0)

    def test_insert_law_record_with_exception(self):
        """Test that insert_law_record handles exceptions gracefully"""
        clear_table(self.conn)

        insert_law_record(self.conn, "law-1", "Text", {}, [0.1] * 384)

        insert_law_record(self.conn, "law-1", "Duplicate", {}, [0.2] * 384)

        self.conn.rollback()

        with self.conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM laws WHERE law_id = 'law-1'")
            count = cur.fetchone()[0]

        self.assertEqual(count, 1)

    def test_insert_paragraph_record_with_exception(self):
        """Test that insert_paragraph_record handles exceptions gracefully"""
        clear_table(self.conn)

        insert_paragraph_record(self.conn, "law-1", "para-1", "§1", "Text", {}, [0.1] * 100)

        self.conn.rollback()

        with self.conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM paragraphs")
            count = cur.fetchone()[0]

        self.assertEqual(count, 0)
