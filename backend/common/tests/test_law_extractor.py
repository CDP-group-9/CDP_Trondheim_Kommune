import os
import tempfile
from unittest import TestCase
from unittest.mock import patch

from common.utils.law_extractor import (
    download_lovdata_file,
    extract_selected_files,
    format_laws_to_lovdata_format,
    list_public_files,
)


class FormatLawsToLovdataFormatTest(TestCase):
    """Test law format conversion logic."""

    def test_format_lov_law(self):
        """Test formatting a LOV law to Lovdata API format"""
        laws = ["LOV-2018-06-15-038"]
        result = format_laws_to_lovdata_format(laws)

        self.assertIn("nl-20180615-038.xml", result)

    def test_format_for_law(self):
        """Test formatting a FOR law to Lovdata API format"""
        laws = ["FOR-2011-08-22-894"]
        result = format_laws_to_lovdata_format(laws)

        self.assertIn("sf-20110822-0894.xml", result)

    def test_format_lov_with_section(self):
        """Test formatting a LOV law with section number"""
        laws = ["LOV-1967-02-10-5"]
        result = format_laws_to_lovdata_format(laws)

        self.assertIn("nl-19670210-005.xml", result)

    def test_format_for_with_section(self):
        """Test formatting a FOR law with section number"""
        laws = ["FOR-2021-12-17-3843"]
        result = format_laws_to_lovdata_format(laws)

        self.assertIn("sf-20211217-3843.xml", result)

    def test_format_multiple_laws(self):
        """Test formatting multiple laws returns a set"""
        laws = ["LOV-2018-06-15-038", "FOR-2011-08-22-894"]
        result = format_laws_to_lovdata_format(laws)

        self.assertEqual(len(result), 2)
        self.assertIsInstance(result, set)

    def test_invalid_format_raises_error(self):
        """Test that invalid law format raises ValueError"""
        laws = ["INVALID"]

        with self.assertRaises(ValueError) as cm:
            format_laws_to_lovdata_format(laws)

        self.assertIn("Illegal law/paragraph-format", str(cm.exception))

    def test_unknown_law_type_raises_error(self):
        """Test that unknown law type raises ValueError"""
        laws = ["UNK-2018-06-15-038"]

        with self.assertRaises(ValueError) as cm:
            format_laws_to_lovdata_format(laws)

        self.assertIn("Unknown value", str(cm.exception))


class ListPublicFilesTest(TestCase):
    """Test listing public files from Lovdata API."""

    @patch("common.utils.law_extractor.requests.get")
    def test_list_public_files_success(self, mock_get):
        """Test successful listing of public files"""
        mock_response = mock_get.return_value
        mock_response.json.return_value = [
            {"filename": "file1.tar.bz2", "size": 1024},
            {"filename": "file2.zip", "size": 2048},
            "invalid_item",
        ]
        mock_response.raise_for_status.return_value = None

        result = list_public_files()

        self.assertEqual(len(result), 2)
        self.assertEqual(result[0]["filename"], "file1.tar.bz2")
        mock_get.assert_called_once_with(
            "https://api.lovdata.no/v1/publicData/list",
            headers={"accept": "application/json"},
            timeout=30.0,
        )

    @patch("common.utils.law_extractor.requests.get")
    def test_list_public_files_with_custom_timeout(self, mock_get):
        """Test listing with custom timeout"""
        mock_response = mock_get.return_value
        mock_response.json.return_value = []
        mock_response.raise_for_status.return_value = None

        list_public_files(timeout=60.0)

        mock_get.assert_called_once_with(
            "https://api.lovdata.no/v1/publicData/list",
            headers={"accept": "application/json"},
            timeout=60.0,
        )


class DownloadLovdataFileTest(TestCase):
    """Test downloading files from Lovdata API."""

    @patch("common.utils.law_extractor.requests.get")
    def test_download_tar_bz2_file(self, mock_get):
        """Test downloading a tar.bz2 file"""
        mock_response = mock_get.return_value.__enter__.return_value
        mock_response.iter_content.return_value = [b"chunk1", b"chunk2"]
        mock_response.raise_for_status.return_value = None

        with tempfile.TemporaryDirectory() as tmpdir:
            result = download_lovdata_file("test.tar.bz2", out_dir=tmpdir)

            self.assertTrue(os.path.exists(result))
            self.assertEqual(result, os.path.join(tmpdir, "test.tar.bz2"))

    @patch("common.utils.law_extractor.requests.get")
    def test_download_zip_file(self, mock_get):
        """Test downloading a zip file"""
        mock_response = mock_get.return_value.__enter__.return_value
        mock_response.iter_content.return_value = [b"data"]
        mock_response.raise_for_status.return_value = None

        with tempfile.TemporaryDirectory() as tmpdir:
            result = download_lovdata_file("test.zip", out_dir=tmpdir)

            self.assertTrue(os.path.exists(result))

    def test_invalid_filename_raises_error(self):
        """Test that invalid filename raises ValueError"""
        with self.assertRaises(ValueError) as cm:
            download_lovdata_file("../../../etc/passwd")

        self.assertIn("Illegal filename", str(cm.exception))

    def test_filename_with_special_chars_raises_error(self):
        """Test that filename with special characters raises ValueError"""
        with self.assertRaises(ValueError):
            download_lovdata_file("test;rm -rf /.tar.bz2")


class ExtractSelectedFilesTest(TestCase):
    """Test extracting selected files from tar.bz2 archives."""

    def test_extract_selected_files_creates_directory(self):
        """Test that extract creates the output directory"""
        with tempfile.TemporaryDirectory() as tmpdir:
            extract_dir = os.path.join(tmpdir, "extract")

            import tarfile

            tar_path = os.path.join(tmpdir, "test.tar.bz2")
            with tarfile.open(tar_path, "w:bz2"):
                pass

            extract_selected_files(tar_path, set(), extract_to=extract_dir)

            self.assertTrue(os.path.exists(extract_dir))

    def test_extract_selected_files_extracts_matching_files(self):
        """Test that matching files are extracted"""
        with tempfile.TemporaryDirectory() as tmpdir:
            import tarfile

            tar_path = os.path.join(tmpdir, "test.tar.bz2")
            test_content = b"Test law content"

            with tarfile.open(tar_path, "w:bz2") as tar:
                import io

                file_data = io.BytesIO(test_content)
                tarinfo = tarfile.TarInfo(name="path/to/nl-20180615-038.xml")
                tarinfo.size = len(test_content)
                tar.addfile(tarinfo, file_data)

            extract_dir = os.path.join(tmpdir, "extract")
            selected_files = {"nl-20180615-038.xml"}

            extract_selected_files(tar_path, selected_files, extract_to=extract_dir)

            extracted_file = os.path.join(extract_dir, "nl-20180615-038.xml")
            self.assertTrue(os.path.exists(extracted_file))

            with open(extracted_file, "rb") as f:
                self.assertEqual(f.read(), test_content)

    def test_extract_selected_files_ignores_non_matching(self):
        """Test that non-matching files are not extracted"""
        with tempfile.TemporaryDirectory() as tmpdir:
            import tarfile

            tar_path = os.path.join(tmpdir, "test.tar.bz2")

            with tarfile.open(tar_path, "w:bz2") as tar:
                import io

                for filename in ["wanted.xml", "unwanted.xml"]:
                    file_data = io.BytesIO(b"content")
                    tarinfo = tarfile.TarInfo(name=filename)
                    tarinfo.size = 7
                    tar.addfile(tarinfo, file_data)

            extract_dir = os.path.join(tmpdir, "extract")
            selected_files = {"wanted.xml"}

            extract_selected_files(tar_path, selected_files, extract_to=extract_dir)

            self.assertTrue(os.path.exists(os.path.join(extract_dir, "wanted.xml")))
            self.assertFalse(os.path.exists(os.path.join(extract_dir, "unwanted.xml")))


class FetchLovdataLawsTest(TestCase):
    """Test the main fetch_lovdata_laws function."""

    @patch("common.utils.law_extractor.list_public_files")
    @patch("common.utils.law_extractor.download_lovdata_file")
    @patch("common.utils.law_extractor.extract_selected_files")
    @patch("common.utils.law_extractor.os.remove")
    @patch("common.utils.law_extractor.os.path.exists")
    @patch("common.utils.law_extractor.os.listdir")
    def test_fetch_lovdata_laws_full_workflow(
        self, mock_listdir, mock_exists, mock_remove, mock_extract, mock_download, mock_list
    ):
        """Test the complete fetch workflow"""
        from common.utils.law_extractor import fetch_lovdata_laws

        mock_list.return_value = [
            {"filename": "archive.tar.bz2"},
            {"filename": "other.zip"},
        ]

        mock_exists.return_value = False

        mock_listdir.return_value = ["nl-20180615-038.xml"]

        with tempfile.TemporaryDirectory() as tmpdir:
            fetch_lovdata_laws(["LOV-2018-06-15-038"], out_dir=tmpdir)

            mock_download.assert_called_once_with("archive.tar.bz2", out_dir=tmpdir)

            mock_extract.assert_called_once()

            mock_remove.assert_called_once()

    @patch("common.utils.law_extractor.list_public_files")
    @patch("common.utils.law_extractor.download_lovdata_file")
    @patch("common.utils.law_extractor.extract_selected_files")
    @patch("common.utils.law_extractor.os.remove")
    @patch("common.utils.law_extractor.os.path.exists")
    @patch("common.utils.law_extractor.os.listdir")
    def test_fetch_lovdata_laws_skips_existing_archive(
        self, mock_listdir, mock_exists, mock_remove, mock_extract, mock_download, mock_list
    ):
        """Test that existing archives are not re-downloaded"""
        from common.utils.law_extractor import fetch_lovdata_laws

        mock_list.return_value = [{"filename": "archive.tar.bz2"}]
        mock_exists.return_value = True
        mock_listdir.return_value = ["nl-20180615-038.xml"]

        with tempfile.TemporaryDirectory() as tmpdir:
            fetch_lovdata_laws(["LOV-2018-06-15-038"], out_dir=tmpdir)

            mock_download.assert_not_called()
            mock_extract.assert_called_once()

    @patch("common.utils.law_extractor.list_public_files")
    @patch("common.utils.law_extractor.os.listdir")
    def test_fetch_lovdata_laws_reports_missing_files(self, mock_listdir, mock_list):
        """Test that missing files are reported"""
        import io
        from contextlib import redirect_stdout

        from common.utils.law_extractor import fetch_lovdata_laws

        mock_list.return_value = []
        mock_listdir.return_value = []

        with tempfile.TemporaryDirectory() as tmpdir:
            f = io.StringIO()
            with redirect_stdout(f):
                fetch_lovdata_laws(["LOV-2018-06-15-038"], out_dir=tmpdir)

            output = f.getvalue()
            self.assertIn("not found", output)
            self.assertIn("nl-20180615-038.xml", output)
