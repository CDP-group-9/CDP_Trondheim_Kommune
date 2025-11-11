from django.contrib.admin.sites import AdminSite
from django.test import TestCase

from users.admin import CustomUserAdmin
from users.models import User


class MockRequest:
    """Mock request for admin tests"""

    pass


class CustomUserAdminTest(TestCase):
    def setUp(self):
        self.site = AdminSite()
        self.admin = CustomUserAdmin(User, self.site)

    def test_list_display(self):
        """Test that list_display is configured correctly"""
        expected_display = ("id", "email", "created", "modified")
        self.assertEqual(self.admin.list_display, expected_display)

    def test_list_filter(self):
        """Test that list_filter is configured correctly"""
        expected_filters = ("is_active", "is_staff", "groups")
        self.assertEqual(self.admin.list_filter, expected_filters)

    def test_search_fields(self):
        """Test that search_fields is configured correctly"""
        expected_search = ("email",)
        self.assertEqual(self.admin.search_fields, expected_search)

    def test_ordering(self):
        """Test that ordering is configured correctly"""
        expected_ordering = ("email",)
        self.assertEqual(self.admin.ordering, expected_ordering)

    def test_filter_horizontal(self):
        """Test that filter_horizontal is configured correctly"""
        expected_horizontal = ("groups", "user_permissions")
        self.assertEqual(self.admin.filter_horizontal, expected_horizontal)

    def test_fieldsets_structure(self):
        """Test that fieldsets are configured correctly"""
        fieldsets = self.admin.fieldsets
        self.assertEqual(len(fieldsets), 2)

        first_fieldset = fieldsets[0]
        self.assertIsNone(first_fieldset[0])
        self.assertIn("email", first_fieldset[1]["fields"])
        self.assertIn("password", first_fieldset[1]["fields"])

        second_fieldset = fieldsets[1]
        self.assertIn("is_active", second_fieldset[1]["fields"])
        self.assertIn("is_staff", second_fieldset[1]["fields"])
        self.assertIn("is_superuser", second_fieldset[1]["fields"])

    def test_add_fieldsets_structure(self):
        """Test that add_fieldsets are configured correctly"""
        add_fieldsets = self.admin.add_fieldsets
        self.assertEqual(len(add_fieldsets), 1)

        fieldset = add_fieldsets[0]
        self.assertIsNone(fieldset[0])
        self.assertIn("email", fieldset[1]["fields"])
        self.assertIn("password1", fieldset[1]["fields"])
        self.assertIn("password2", fieldset[1]["fields"])

    def test_admin_is_registered(self):
        """Test that CustomUserAdmin is properly registered"""
        from django.contrib import admin

        self.assertTrue(admin.site.is_registered(User))
        registered_admin = admin.site._registry[User]
        self.assertIsInstance(registered_admin, CustomUserAdmin)

    def test_get_queryset(self):
        """Test that get_queryset works correctly"""
        User.objects.create_user(email="test1@example.com", password="pass")
        User.objects.create_user(email="test2@example.com", password="pass")

        request = MockRequest()
        queryset = self.admin.get_queryset(request)
        self.assertEqual(queryset.count(), 2)
