from .views import CounterViewSet, RestViewSet, ChatViewSet


routes = [
    {"regex": r"rest", "viewset": RestViewSet, "basename": "Rest"},
    {"regex": r"counter", "viewset": CounterViewSet, "basename": "counter"},
    {"regex": r"chat", "viewset": ChatViewSet, "basename": "chat"},
]
