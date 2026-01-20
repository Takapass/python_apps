from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Shift(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    hourly_wage = models.IntegerField(default=1000) 

    def __str__(self):
        return f"{self.user.username} {self.date}"