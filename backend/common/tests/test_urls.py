from django.test import TestCase
from django.urls import resolve, reverse


class CommonURLsTest(TestCase):
    def test_index_url_resolves(self):
        """Test that the index URL resolves correctly"""
        url = reverse("common:index")
        self.assertEqual(url, "/")

    def test_index_url_name(self):
        """Test that the index URL has correct name"""
        resolver = resolve("/")
        self.assertEqual(resolver.view_name, "common:index")

    def test_index_url_uses_correct_view(self):
        """Test that index URL uses IndexView"""
        from common.views import IndexView

        resolver = resolve("/")
        self.assertEqual(resolver.func.view_class, IndexView)
