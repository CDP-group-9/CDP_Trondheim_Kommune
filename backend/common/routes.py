from .views import CounterViewSet, RestViewSet


routes = [
    {"regex": r"rest", "viewset": RestViewSet, "basename": "Rest"},
    {"regex": r"counter", "viewset": CounterViewSet, "basename": "counter"}
]
