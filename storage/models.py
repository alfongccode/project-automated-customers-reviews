from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):    
    username = models.CharField(max_length=50, unique=True)
    email = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "users"

    def __str__(self):
        return self.username