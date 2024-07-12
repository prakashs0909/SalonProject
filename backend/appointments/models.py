from django.db import models
from django.contrib.auth.models import User

class Appointment(models.Model):
    customer_name = models.CharField(max_length=100, null=True, blank=True)
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    checklist = models.JSONField(default=list, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.customer_name} - {self.appointment_date} at {self.appointment_time}"
