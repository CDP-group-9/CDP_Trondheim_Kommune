from django.test import TestCase

from common.routes import routes
from common.views import ChatViewSet, MockResponseViewSet


class CommonRoutesTest(TestCase):
    def test_routes_structure(self):
        """Test that routes have the correct structure"""
        self.assertIsInstance(routes, list)
        self.assertEqual(len(routes), 2)

    def test_chat_route(self):
        """Test that chat route is configured correctly"""
        chat_route = next((r for r in routes if r["basename"] == "chat"), None)
        self.assertIsNotNone(chat_route)
        self.assertEqual(chat_route["regex"], r"chat")
        self.assertEqual(chat_route["viewset"], ChatViewSet)

    def test_test_response_route(self):
        """Test that test-response route is configured correctly"""
        test_response_route = next((r for r in routes if r["basename"] == "test-response"), None)
        self.assertIsNotNone(test_response_route)
        self.assertEqual(test_response_route["regex"], r"test-response")
        self.assertEqual(test_response_route["viewset"], MockResponseViewSet)

    def test_all_routes_have_required_keys(self):
        """Test that all routes have required keys"""
        required_keys = {"regex", "viewset", "basename"}
        for route in routes:
            self.assertTrue(required_keys.issubset(route.keys()))
