from .views import CounterViewSet, MockResponseViewSet, RestViewSet


routes = [
    {"regex": r"rest", "viewset": RestViewSet, "basename": "Rest"},
    {"regex": r"counter", "viewset": CounterViewSet, "basename": "counter"},
    {"regex": r"test-response", "viewset": MockResponseViewSet, "basename": "test-response"},
]
