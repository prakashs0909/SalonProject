from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from .models import Appointment, Service
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, AppointmentSerializer, ServiceSerializer

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
        return Response(UserSerializer(user).data)

class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        logout(request)
        return Response(status=status.HTTP_200_OK)



class AppointmentListView(generics.ListCreateAPIView):
    queryset = Appointment.objects.all().order_by("-id")
    serializer_class = AppointmentSerializer

    def perform_create(self, serializer):
        appointment_date = serializer.validated_data['appointment_date']
        appointment_time = serializer.validated_data['appointment_time']

        if Appointment.objects.filter(appointment_date=appointment_date, appointment_time=appointment_time).exists():
            raise ValidationError('This time slot is already booked.')

        serializer.save()

class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Appointment.objects.all().order_by("-id")
    serializer_class = AppointmentSerializer

    def perform_update(self, serializer):
        appointment_date = serializer.validated_data.get('appointment_date', self.get_object().appointment_date)
        appointment_time = serializer.validated_data.get('appointment_time', self.get_object().appointment_time)

        if Appointment.objects.filter(appointment_date=appointment_date, appointment_time=appointment_time).exclude(pk=self.get_object().pk).exists():
            raise ValidationError('This time slot is already booked.')

        serializer.save()

class AppointmentHistoryView(APIView):

    def get(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({"error": "User ID is required"}, status=400)

        appointments = Appointment.objects.filter(user_id=user_id)
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
