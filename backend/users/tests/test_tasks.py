from unittest.mock import patch

from django.test import TestCase

from users.tasks import clearsessions


class ClearSessionsTaskTest(TestCase):
    @patch("users.tasks.management.call_command")
    def test_calls_management_command(self, mock_call_command):
        """Test that clearsessions calls the Django management command"""
        clearsessions()

        mock_call_command.assert_called_once_with("clearsessions")

    @patch("users.tasks.management.call_command")
    def test_celery_task_attributes(self, mock_call_command):
        """Test that clearsessions has Celery task attributes"""
        self.assertTrue(hasattr(clearsessions, "delay"))
        self.assertTrue(hasattr(clearsessions, "apply_async"))

        clearsessions()

        mock_call_command.assert_called_once_with("clearsessions")
