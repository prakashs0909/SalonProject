from rest_framework import generics
from .models import Appointment
from .serializers import AppointmentSerializer
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated

class AppointmentListView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        appointment_date = serializer.validated_data['appointment_date']
        appointment_time = serializer.validated_data['appointment_time']

        if Appointment.objects.filter(appointment_date=appointment_date, appointment_time=appointment_time).exists():
            raise ValidationError('This time slot is already booked.')

        serializer.save(user=self.request.user)

class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AppointmentSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.all()

    def perform_update(self, serializer):
        appointment_date = serializer.validated_data.get('appointment_date', self.get_object().appointment_date)
        appointment_time = serializer.validated_data.get('appointment_time', self.get_object().appointment_time)

        if Appointment.objects.filter(appointment_date=appointment_date, appointment_time=appointment_time).exclude(pk=self.get_object().pk).exists():
            raise ValidationError('This time slot is already booked.')

        serializer.save(user=self.request.user)
