from django.db import models
from django.utils.translation import gettext_lazy as _

from model_utils.fields import AutoCreatedField, AutoLastModifiedField


class IndexedTimeStampedModel(models.Model):
    created = AutoCreatedField(_("created"), db_index=True)
    modified = AutoLastModifiedField(_("modified"), db_index=True)

    class Meta:
        abstract = True


class MockResponse(models.Model):
    response = models.TextField()

    def __str__(self):
        return self.response


class Counter(models.Model):
    value = models.IntegerField(default=0)

    def __str__(self):
        return f"Counter: {self.value}"
