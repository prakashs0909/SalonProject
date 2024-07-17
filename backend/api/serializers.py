from rest_framework import serializers
from .models import Appointment , Service
from datetime import datetime 



class AppointmentSerializer(serializers.ModelSerializer):
    checklist = serializers.JSONField(required=False)
    appointment_time = serializers.CharField() 

    class Meta:
        model = Appointment
        fields = ['id', 'user' ,'customer_name', 'appointment_date', 'appointment_time', 'checklist']
    
    def validate_appointment_time(self, value):
        try:
            # Convert 12-hour format with AM/PM to 24-hour format
            time_obj = datetime.strptime(value, '%I:%M %p').time()
        except ValueError:
            raise serializers.ValidationError("Time has wrong format. Use 'HH:MM AM/PM'.")
        return time_obj

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'price', 'time']



from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid credentials")