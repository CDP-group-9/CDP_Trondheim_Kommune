from django.core import management

from CDP_Trondheim_Kommune import celery_app


@celery_app.task
def clearsessions():
    management.call_command("clearsessions")
