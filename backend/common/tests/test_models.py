from django.test import TestCase

from common.models import Counter, IndexedTimeStampedModel, MockResponse


class MockResponseTest(TestCase):
    def test_create_mock_response(self):
        """Test creating a MockResponse object"""
        response_text = "This is a test response"
        mock_response = MockResponse.objects.create(response=response_text)

        self.assertEqual(mock_response.response, response_text)
        self.assertIsNotNone(mock_response.id)

    def test_str_representation(self):
        """Test string representation returns the response text"""
        response_text = "Test response string"
        mock_response = MockResponse.objects.create(response=response_text)

        self.assertEqual(str(mock_response), response_text)

    def test_query_by_content(self):
        """Test filtering MockResponse by content"""
        MockResponse.objects.create(response="DPIA related response")
        MockResponse.objects.create(response="Anonymisere related response")

        dpia_results = MockResponse.objects.filter(response__icontains="dpia")
        self.assertEqual(dpia_results.count(), 1)

        anon_results = MockResponse.objects.filter(response__icontains="anonymisere")
        self.assertEqual(anon_results.count(), 1)


class CounterTest(TestCase):
    def test_create_counter(self):
        """Test creating a Counter with default value"""
        counter = Counter.objects.create()

        self.assertEqual(counter.value, 0)
        self.assertIsNotNone(counter.id)

    def test_create_with_custom_value(self):
        """Test creating a Counter with custom value"""
        counter = Counter.objects.create(value=10)

        self.assertEqual(counter.value, 10)

    def test_increment(self):
        """Test incrementing a Counter"""
        counter = Counter.objects.create(value=5)
        counter.value += 1
        counter.save()

        counter.refresh_from_db()
        self.assertEqual(counter.value, 6)

    def test_str_representation(self):
        """Test string representation of Counter"""
        counter = Counter.objects.create(value=42)

        self.assertEqual(str(counter), "Counter: 42")

    def test_get_or_create(self):
        """Test get_or_create for Counter"""
        counter1, created1 = Counter.objects.get_or_create(id=1)
        self.assertTrue(created1)
        self.assertEqual(counter1.value, 0)

        counter2, created2 = Counter.objects.get_or_create(id=1)
        self.assertFalse(created2)
        self.assertEqual(counter1.id, counter2.id)


class IndexedTimeStampedModelTest(TestCase):
    def test_is_abstract(self):
        """Test that IndexedTimeStampedModel is abstract"""
        self.assertTrue(IndexedTimeStampedModel._meta.abstract)

    def test_has_timestamp_fields(self):
        """Test that model has created and modified fields"""
        fields = [field.name for field in IndexedTimeStampedModel._meta.get_fields()]

        self.assertIn("created", fields)
        self.assertIn("modified", fields)

    def test_fields_have_db_index(self):
        """Test that timestamp fields have database indexes"""
        created_field = IndexedTimeStampedModel._meta.get_field("created")
        modified_field = IndexedTimeStampedModel._meta.get_field("modified")

        self.assertTrue(created_field.db_index)
        self.assertTrue(modified_field.db_index)
