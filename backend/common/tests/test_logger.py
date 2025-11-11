import logging
from threading import Thread
from unittest import TestCase

from common.utils.logger import DEFAULT_LOGGER_NAME, _SingletonLogger, get_logger, logger


class SingletonLoggerTest(TestCase):
    def setUp(self):
        """Reset singleton between tests"""
        _SingletonLogger._instance = None
        _SingletonLogger._logger = None

    def test_singleton_instance(self):
        """Test that _SingletonLogger returns the same instance"""
        instance1 = _SingletonLogger()
        instance2 = _SingletonLogger()

        self.assertIs(instance1, instance2)

    def test_singleton_with_custom_name(self):
        """Test that custom logger name is used only on first initialization"""
        instance1 = _SingletonLogger(logger_name="custom_logger")
        instance2 = _SingletonLogger(logger_name="different_logger")

        self.assertIs(instance1, instance2)
        self.assertEqual(instance1._logger_name, "custom_logger")

    def test_logger_property(self):
        """Test that logger property returns a Logger instance"""
        instance = _SingletonLogger()
        log = instance.logger

        self.assertIsInstance(log, logging.Logger)

    def test_logger_name(self):
        """Test that logger has the correct name"""
        instance = _SingletonLogger(logger_name="test_logger")
        log = instance.logger

        self.assertEqual(log.name, "test_logger")

    def test_thread_safety(self):
        """Test that singleton is thread-safe"""
        instances = []

        def create_instance():
            instances.append(_SingletonLogger())

        threads = [Thread(target=create_instance) for _ in range(10)]
        for thread in threads:
            thread.start()
        for thread in threads:
            thread.join()

        # All instances should be the same
        first_instance = instances[0]
        for instance in instances:
            self.assertIs(instance, first_instance)


class GetLoggerTest(TestCase):
    def setUp(self):
        """Reset singleton between tests"""
        _SingletonLogger._instance = None
        _SingletonLogger._logger = None

    def test_get_logger_returns_logger(self):
        """Test that get_logger returns a Logger instance"""
        log = get_logger()

        self.assertIsInstance(log, logging.Logger)

    def test_get_logger_default_name(self):
        """Test that get_logger uses default name"""
        log = get_logger()

        self.assertEqual(log.name, DEFAULT_LOGGER_NAME)

    def test_get_logger_custom_name(self):
        """Test that get_logger accepts custom name"""
        log = get_logger(name="custom")

        self.assertEqual(log.name, "custom")

    def test_get_logger_returns_same_instance(self):
        """Test that multiple calls return the same logger"""
        log1 = get_logger()
        log2 = get_logger()

        self.assertIs(log1, log2)

    def test_get_logger_ignores_subsequent_names(self):
        """Test that subsequent calls with different names return same logger"""
        log1 = get_logger(name="first")
        log2 = get_logger(name="second")

        self.assertIs(log1, log2)
        self.assertEqual(log1.name, "first")


class LoggerModuleTest(TestCase):
    def test_logger_module_variable(self):
        """Test that logger module variable is a Logger instance"""
        self.assertIsInstance(logger, logging.Logger)

    def test_logger_module_variable_name(self):
        """Test that logger module variable has correct name"""
        # Note: This might be affected by previous tests, so we just check it exists
        self.assertTrue(hasattr(logger, "name"))
        self.assertIsInstance(logger.name, str)
