from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer
from django.contrib.auth.models import User
from rest_framework.views import APIView


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        login(request, user)
        print(request.user)
        return Response(UserSerializer(user).data)

class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        logout(request)
        return Response(status=status.HTTP_200_OK)


from rest_framework import generics
from .models import Appointment ,Service
from .serializers import AppointmentSerializer , ServiceSerializer
from rest_framework.exceptions import ValidationError
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response



class AppointmentListView(generics.ListCreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    def perform_create(self, serializer):
        appointment_date = serializer.validated_data['appointment_date']
        appointment_time = serializer.validated_data['appointment_time']

        if Appointment.objects.filter(appointment_date=appointment_date, appointment_time=appointment_time).exists():
            raise ValidationError('This time slot is already booked.')

        serializer.save()

class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    def perform_update(self, serializer):
        appointment_date = serializer.validated_data.get('appointment_date', self.get_object().appointment_date)
        appointment_time = serializer.validated_data.get('appointment_time', self.get_object().appointment_time)

        if Appointment.objects.filter(appointment_date=appointment_date, appointment_time=appointment_time).exclude(pk=self.get_object().pk).exists():
            raise ValidationError('This time slot is already booked.')

        serializer.save()

class AppointmentHistoryView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        print(request.user)
        # Fetch user's appointments logic here
        appointments = Appointment.objects.filter(user = request.user.id)
        print(request.user.id)
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer



