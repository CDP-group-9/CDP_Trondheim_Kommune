from .views import (
    ChatViewSet,
    MockResponseViewSet,
)


routes = [
    {"regex": r"chat", "viewset": ChatViewSet, "basename": "chat"},
    {"regex": r"test-response", "viewset": MockResponseViewSet, "basename": "test-response"},
]
