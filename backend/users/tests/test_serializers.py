from django.test import TestCase

from users.models import User
from users.serializers import UserSerializer


class UserSerializerTest(TestCase):
    def test_serialization(self):
        """Test serializing a User object with all expected fields"""
        user = User.objects.create_user(email="test@example.com", password="testpass123")
        serializer = UserSerializer(user)

        self.assertEqual(serializer.data["email"], "test@example.com")
        self.assertEqual(serializer.data["is_active"], True)
        self.assertEqual(serializer.data["is_staff"], False)
        self.assertEqual(serializer.data["is_superuser"], False)
        self.assertNotIn("password", serializer.data)

    def test_serialization_with_superuser(self):
        """Test serializing a superuser"""
        user = User.objects.create_superuser(email="admin@example.com", password="adminpass123")
        serializer = UserSerializer(user)

        self.assertTrue(serializer.data["is_staff"])
        self.assertTrue(serializer.data["is_superuser"])

    def test_deserialization_valid_data(self):
        """Test deserializing valid data"""
        data = {
            "email": "newuser@example.com",
            "is_active": True,
            "is_staff": False,
            "is_superuser": False,
        }
        serializer = UserSerializer(data=data)

        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data["email"], "newuser@example.com")

    def test_deserialization_invalid_email(self):
        """Test deserialization fails with invalid email"""
        data = {
            "email": "not-an-email",
            "is_active": True,
        }
        serializer = UserSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)

    def test_deserialization_missing_email(self):
        """Test deserialization fails without email"""
        data = {"is_active": True}
        serializer = UserSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)

    def test_update_user(self):
        """Test updating a user through serializer"""
        user = User.objects.create_user(email="test@example.com", password="testpass123")
        data = {"email": "updated@example.com", "is_active": False}
        serializer = UserSerializer(user, data=data, partial=True)

        self.assertTrue(serializer.is_valid())
        updated_user = serializer.save()
        self.assertEqual(updated_user.email, "updated@example.com")
        self.assertFalse(updated_user.is_active)
