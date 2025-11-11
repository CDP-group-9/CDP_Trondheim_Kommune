from django.test import TestCase

from users.routes import routes
from users.views import UserViewSet


class UserRoutesTest(TestCase):
    def test_routes_structure(self):
        """Test that routes have the correct structure"""
        self.assertIsInstance(routes, list)
        self.assertEqual(len(routes), 1)

    def test_users_route(self):
        """Test that users route is configured correctly"""
        user_route = routes[0]
        self.assertEqual(user_route["regex"], r"users")
        self.assertEqual(user_route["viewset"], UserViewSet)
        self.assertEqual(user_route["basename"], "user")

    def test_route_has_required_keys(self):
        """Test that route has required keys"""
        required_keys = {"regex", "viewset", "basename"}
        self.assertTrue(required_keys.issubset(routes[0].keys()))
