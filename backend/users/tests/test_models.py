from django.db import IntegrityError
from django.test import TestCase

from users.models import User


class UserManagerTest(TestCase):
    def test_create_user(self):
        """Test creating a regular user"""
        email = "test@example.com"
        password = "testpass123"

        user = User.objects.create_user(email=email, password=password)

        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertTrue(user.is_active)

    def test_create_user_with_extra_fields(self):
        """Test creating a user with extra fields"""
        email = "test@example.com"
        password = "testpass123"

        user = User.objects.create_user(email=email, password=password, is_active=False)

        self.assertEqual(user.email, email)
        self.assertFalse(user.is_active)

    def test_create_user_normalizes_email(self):
        """Test that email is normalized when creating a user"""
        email = "Test@EXAMPLE.com"
        password = "testpass123"

        user = User.objects.create_user(email=email, password=password)

        self.assertEqual(user.email, "Test@example.com")

    def test_create_user_without_password(self):
        """Test creating a user without a password"""
        email = "test@example.com"

        user = User.objects.create_user(email=email)

        self.assertEqual(user.email, email)
        self.assertFalse(user.has_usable_password())

    def test_create_superuser(self):
        """Test creating a superuser"""
        email = "admin@example.com"
        password = "adminpass123"

        user = User.objects.create_superuser(email=email, password=password)

        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_active)

    def test_create_superuser_normalizes_email(self):
        """Test that email is normalized when creating a superuser"""
        email = "Admin@EXAMPLE.com"
        password = "adminpass123"

        user = User.objects.create_superuser(email=email, password=password)

        self.assertEqual(user.email, "Admin@example.com")

    def test_create_multiple_users(self):
        """Test creating multiple users"""
        user1 = User.objects.create_user(email="user1@example.com", password="pass123")
        user2 = User.objects.create_user(email="user2@example.com", password="pass456")

        self.assertEqual(User.objects.count(), 2)
        self.assertNotEqual(user1.id, user2.id)
        self.assertNotEqual(user1.email, user2.email)


class UserModelTest(TestCase):
    def test_str_representation(self):
        """Test that User string representation returns email"""
        email = "test@example.com"
        user = User.objects.create_user(email=email, password="testpass")

        self.assertEqual(str(user), email)

    def test_get_full_name(self):
        """Test that get_full_name returns email"""
        email = "test@example.com"
        user = User.objects.create_user(email=email, password="testpass")

        self.assertEqual(user.get_full_name(), email)

    def test_get_short_name(self):
        """Test that get_short_name returns email"""
        email = "test@example.com"
        user = User.objects.create_user(email=email, password="testpass")

        self.assertEqual(user.get_short_name(), email)

    def test_timestamp_fields(self):
        """Test that User has created and modified timestamp fields"""
        user = User.objects.create_user(email="test@example.com", password="testpass")

        self.assertIsNotNone(user.created)
        self.assertIsNotNone(user.modified)

    def test_email_unique(self):
        """Test that user email must be unique"""
        email = "test@example.com"
        User.objects.create_user(email=email, password="testpass1")

        with self.assertRaises(IntegrityError):
            User.objects.create_user(email=email, password="testpass2")

    def test_is_active_default(self):
        """Test that is_active defaults to True"""
        user = User.objects.create_user(email="test@example.com", password="testpass")

        self.assertTrue(user.is_active)

    def test_is_staff_default(self):
        """Test that is_staff defaults to False"""
        user = User.objects.create_user(email="test@example.com", password="testpass")

        self.assertFalse(user.is_staff)

    def test_username_field(self):
        """Test that USERNAME_FIELD is set to email"""
        self.assertEqual(User.USERNAME_FIELD, "email")

    def test_permissions(self):
        """Test that User has permission-related attributes"""
        user = User.objects.create_user(email="test@example.com", password="testpass")

        self.assertFalse(user.is_superuser)
        self.assertIsNotNone(user.groups)
        self.assertIsNotNone(user.user_permissions)
