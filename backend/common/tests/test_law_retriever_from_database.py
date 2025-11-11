from unittest import TestCase
from unittest.mock import MagicMock, patch

from common.utils.law_retriever_from_database import LawRetriever


def _create_mock_embedding():
    """Helper to create a mock embedding array with tolist() method"""
    mock_array = MagicMock()
    mock_array.tolist.return_value = [0.1] * 384
    return mock_array


class LawRetrieverInitTest(TestCase):
    @patch("common.utils.law_retriever_from_database.psycopg2.connect")
    @patch("common.utils.law_retriever_from_database.TextEmbedding")
    def test_init_with_default_config(self, mock_embedding, mock_connect):
        """Test initialization with default database config"""
        mock_conn = MagicMock()
        mock_connect.return_value = mock_conn
        mock_model = MagicMock()
        mock_embedding.return_value = mock_model

        retriever = LawRetriever()

        mock_connect.assert_called_once_with(
            dbname="CDP_Trondheim_Kommune",
            user="CDP_Trondheim_Kommune",
            password="password",
            host="db",
            port="5432",
        )
        mock_embedding.assert_called_once_with(model_name="BAAI/bge-small-en-v1.5")
        self.assertEqual(retriever.conn, mock_conn)
        self.assertEqual(retriever.model, mock_model)

    @patch("common.utils.law_retriever_from_database.psycopg2.connect")
    @patch("common.utils.law_retriever_from_database.TextEmbedding")
    def test_init_with_custom_config(self, mock_embedding, mock_connect):
        """Test initialization with custom database config"""
        custom_config = {
            "dbname": "test_db",
            "user": "test_user",
            "password": "test_pass",
            "host": "localhost",
            "port": "5433",
        }
        mock_conn = MagicMock()
        mock_connect.return_value = mock_conn

        LawRetriever(db_config=custom_config)

        mock_connect.assert_called_once_with(**custom_config)

    @patch("common.utils.law_retriever_from_database.psycopg2.connect")
    @patch("common.utils.law_retriever_from_database.TextEmbedding")
    def test_init_with_custom_model(self, mock_embedding, mock_connect):
        """Test initialization with custom embedding model"""
        LawRetriever(model_name="custom-model")

        mock_embedding.assert_called_once_with(model_name="custom-model")


class LawRetrieverRetrieveTest(TestCase):
    @patch("common.utils.law_retriever_from_database.psycopg2.connect")
    @patch("common.utils.law_retriever_from_database.TextEmbedding")
    def test_retrieve_with_empty_prompt(self, mock_embedding, mock_connect):
        """Test that empty prompt returns empty dict"""
        retriever = LawRetriever()

        result = retriever.retrieve("")

        self.assertEqual(result, {})

    @patch("common.utils.law_retriever_from_database.psycopg2.connect")
    @patch("common.utils.law_retriever_from_database.TextEmbedding")
    def test_retrieve_with_whitespace_prompt(self, mock_embedding, mock_connect):
        """Test that whitespace-only prompt returns empty dict"""
        retriever = LawRetriever()

        result = retriever.retrieve("   ")

        self.assertEqual(result, {})

    @patch("common.utils.law_retriever_from_database.psycopg2.connect")
    @patch("common.utils.law_retriever_from_database.TextEmbedding")
    def test_retrieve_with_law_id(self, mock_embedding, mock_connect):
        """Test retrieve with specific law_id"""
        mock_cursor = MagicMock()
        mock_cursor.fetchall.return_value = [
            ("p1", "§2", "Test paragraph", {}, "law123", 0.15)
        ]
        mock_conn = MagicMock()
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        mock_connect.return_value = mock_conn

        mock_model = MagicMock()
        mock_model.embed.return_value = iter([_create_mock_embedding()])
        mock_embedding.return_value = mock_model

        retriever = LawRetriever()
        result = retriever.retrieve("test query", law_id="law123", k_paragraphs=10)

        self.assertEqual(result["laws"], [{"law_id": "law123"}])
        self.assertIn("paragraphs", result)

    @patch("common.utils.law_retriever_from_database.psycopg2.connect")
    @patch("common.utils.law_retriever_from_database.TextEmbedding")
    def test_retrieve_no_laws_found(self, mock_embedding, mock_connect):
        """Test retrieve when no laws are found"""
        mock_cursor = MagicMock()
        mock_cursor.fetchall.return_value = []
        mock_conn = MagicMock()
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        mock_connect.return_value = mock_conn

        mock_model = MagicMock()
        mock_model.embed.return_value = iter([_create_mock_embedding()])
        mock_embedding.return_value = mock_model

        retriever = LawRetriever()
        result = retriever.retrieve("test query")

        self.assertEqual(result, {"laws": [], "paragraphs": []})

    @patch("common.utils.law_retriever_from_database.psycopg2.connect")
    @patch("common.utils.law_retriever_from_database.TextEmbedding")
    def test_retrieve_with_laws_and_paragraphs(self, mock_embedding, mock_connect):
        """Test full retrieve with laws and paragraphs"""
        mock_cursor = MagicMock()
        mock_cursor.fetchall.side_effect = [
            [("law1", {"title": "Test Law"})],
            [("p1", "§2", "Paragraph text", {}, "law1", 0.15)],
        ]
        mock_conn = MagicMock()
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        mock_connect.return_value = mock_conn

        mock_model = MagicMock()
        mock_model.embed.side_effect = [
            iter([_create_mock_embedding()]),
            iter([_create_mock_embedding()]),
        ]
        mock_embedding.return_value = mock_model

        retriever = LawRetriever()
        result = retriever.retrieve("test query", k_laws=1, k_paragraphs=10)

        self.assertEqual(len(result["laws"]), 1)
        self.assertEqual(result["laws"][0]["law_id"], "law1")
        self.assertIn("paragraphs", result)
        self.assertIn("paragraphs_text", result)


class LawRetrieverCleanTextTest(TestCase):
    @patch("common.utils.law_retriever_from_database.psycopg2.connect")
    @patch("common.utils.law_retriever_from_database.TextEmbedding")
    def test_clean_text_removes_metadata(self, mock_embedding, mock_connect):
        """Test that _clean_text removes metadata keywords"""
        retriever = LawRetriever()

        text = "XML generert some data Tittel Test Document § 1 This is the actual content"
        cleaned = retriever._clean_text(text)

        self.assertNotIn("XML generert", cleaned)
        self.assertNotIn("Tittel", cleaned)
        self.assertIn("§ 1", cleaned)

    @patch("common.utils.law_retriever_from_database.psycopg2.connect")
    @patch("common.utils.law_retriever_from_database.TextEmbedding")
    def test_clean_text_normalizes_whitespace(self, mock_embedding, mock_connect):
        """Test that _clean_text normalizes whitespace"""
        retriever = LawRetriever()

        text = "Test   text   with    multiple    spaces"
        cleaned = retriever._clean_text(text)

        self.assertNotIn("  ", cleaned)
        self.assertEqual(cleaned, "Test text with multiple spaces")

    @patch("common.utils.law_retriever_from_database.psycopg2.connect")
    @patch("common.utils.law_retriever_from_database.TextEmbedding")
    def test_clean_text_extracts_sections(self, mock_embedding, mock_connect):
        """Test that _clean_text extracts section text"""
        retriever = LawRetriever()

        text = "Preamble text § 1 First section § 2 Second section"
        cleaned = retriever._clean_text(text)

        self.assertIn("§ 1", cleaned)
        self.assertIn("First section", cleaned)
        self.assertIn("§ 2", cleaned)
        self.assertIn("Second section", cleaned)

    @patch("common.utils.law_retriever_from_database.psycopg2.connect")
    @patch("common.utils.law_retriever_from_database.TextEmbedding")
    def test_clean_text_truncates_long_text(self, mock_embedding, mock_connect):
        """Test that _clean_text truncates text longer than 600 words"""
        retriever = LawRetriever()

        text = " ".join(["word"] * 700)
        cleaned = retriever._clean_text(text)

        word_count = len(cleaned.split())
        self.assertEqual(word_count, 600)

    @patch("common.utils.law_retriever_from_database.psycopg2.connect")
    @patch("common.utils.law_retriever_from_database.TextEmbedding")
    def test_clean_text_strips_whitespace(self, mock_embedding, mock_connect):
        """Test that _clean_text strips leading/trailing whitespace"""
        retriever = LawRetriever()

        text = "  Test content  "
        cleaned = retriever._clean_text(text)

        self.assertEqual(cleaned, "Test content")


class LawRetrieverParagraphFilteringTest(TestCase):
    @patch("common.utils.law_retriever_from_database.psycopg2.connect")
    @patch("common.utils.law_retriever_from_database.TextEmbedding")
    def test_filters_by_distance_threshold(self, mock_embedding, mock_connect):
        """Test that paragraphs are filtered by cosine distance threshold"""
        mock_cursor = MagicMock()
        mock_cursor.fetchall.side_effect = [
            [("law1", {"title": "Test Law"})],
            [
                ("p1", "§2", "Close match", {}, "law1", 0.1),
                ("p2", "§3", "Far match", {}, "law1", 0.5),
            ],
        ]
        mock_conn = MagicMock()
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        mock_connect.return_value = mock_conn

        mock_model = MagicMock()
        mock_model.embed.side_effect = [
            iter([_create_mock_embedding()]),
            iter([_create_mock_embedding()]),
        ]
        mock_embedding.return_value = mock_model

        retriever = LawRetriever()
        result = retriever.retrieve(
            "test query", k_laws=1, k_paragraphs=10, distance_threshold=0.27
        )

        self.assertEqual(len(result["paragraphs"]), 1)
        self.assertEqual(result["paragraphs"][0]["cosine_distance"], 0.1)

    @patch("common.utils.law_retriever_from_database.psycopg2.connect")
    @patch("common.utils.law_retriever_from_database.TextEmbedding")
    def test_filters_out_first_chapter(self, mock_embedding, mock_connect):
        """Test that § 1 (first chapter) is filtered out"""
        mock_cursor = MagicMock()
        mock_cursor.fetchall.side_effect = [
            [("law1", {"title": "Test Law"})],
            [
                ("p1", "§ 1", "First chapter", {}, "law1", 0.1),
                ("p2", "§ 2", "Second chapter", {}, "law1", 0.15),
            ],
        ]
        mock_conn = MagicMock()
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        mock_connect.return_value = mock_conn

        mock_model = MagicMock()
        mock_model.embed.side_effect = [
            iter([_create_mock_embedding()]),
            iter([_create_mock_embedding()]),
        ]
        mock_embedding.return_value = mock_model

        retriever = LawRetriever()
        result = retriever.retrieve("test query", k_laws=1, k_paragraphs=10)

        self.assertEqual(len(result["paragraphs"]), 1)
        self.assertEqual(result["paragraphs"][0]["paragraph_number"], "§ 2")
