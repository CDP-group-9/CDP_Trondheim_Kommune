from django.conf import settings
from django.test import RequestFactory, TestCase

from common.context_processors import commit_sha, sentry_dsn


class ContextProcessorsTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.request = self.factory.get("/")

    def test_sentry_dsn(self):
        """Test that sentry_dsn returns dict with SENTRY_DSN from settings"""
        result = sentry_dsn(self.request)

        self.assertIsInstance(result, dict)
        self.assertIn("SENTRY_DSN", result)
        self.assertEqual(result["SENTRY_DSN"], settings.SENTRY_DSN)

    def test_commit_sha(self):
        """Test that commit_sha returns dict with COMMIT_SHA from settings"""
        result = commit_sha(self.request)

        self.assertIsInstance(result, dict)
        self.assertIn("COMMIT_SHA", result)
        self.assertEqual(result["COMMIT_SHA"], settings.COMMIT_SHA)
