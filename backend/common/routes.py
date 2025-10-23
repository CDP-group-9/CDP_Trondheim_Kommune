from .views import ChatViewSet, ChecklistViewSet, CounterViewSet, MockResponseViewSet, RestViewSet


routes = [
    {"regex": r"rest", "viewset": RestViewSet, "basename": "Rest"},
    {"regex": r"counter", "viewset": CounterViewSet, "basename": "counter"},
    {"regex": r"chat", "viewset": ChatViewSet, "basename": "chat"},
    {"regex": r"test-response", "viewset": MockResponseViewSet, "basename": "test-response"},
    {"regex": r"checklist", "viewset": ChecklistViewSet, "basename": "checklist"},
]
