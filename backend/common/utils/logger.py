"""
Centralized singleton logger factory tailored for the Django backend.

Instead of scattering ``logging.getLogger(__name__)`` calls across the codebase,
this helper guarantees that all modules share the same, lazily initialised logger
instance. Django applies the `LOGGING` dictConfig during startup, so we lean on
that configuration and avoid adding handlers or filters here to prevent
duplicates.
"""

from __future__ import annotations

import logging
from threading import Lock

DEFAULT_LOGGER_NAME = "cdp"


class _SingletonLogger:
    """Thread-safe singleton wrapper around a configured :class:`logging.Logger`."""

    _instance: _SingletonLogger | None = None
    _logger: logging.Logger | None = None
    _logger_name: str = DEFAULT_LOGGER_NAME
    _lock: Lock = Lock()

    def __new__(cls, logger_name: str = DEFAULT_LOGGER_NAME) -> "_SingletonLogger":
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._logger_name = logger_name
                    cls._logger = logging.getLogger(logger_name)
        return cls._instance

    @property
    def logger(self) -> logging.Logger:
        if self._logger is None:
            self._logger = logging.getLogger(self._logger_name)
        return self._logger


def get_logger(name: str = DEFAULT_LOGGER_NAME) -> logging.Logger:
    """
    Return the shared logger instance for the backend.

    Args:
        name: Optional custom logger name. Subsequent calls ignore the name and
            keep returning the existing singleton instance.
    """

    singleton = _SingletonLogger(logger_name=name)
    return singleton.logger


logger = get_logger()
"""Convenience alias so modules can ``from ...logger import logger``."""
