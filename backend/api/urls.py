from django.urls import path , include
from rest_framework.routers import DefaultRouter
from .views import AppointmentListView, AppointmentDetailView, ServiceViewSet ,AppointmentHistoryView
from .views import RegisterView, LoginView, LogoutView

# this is automatic way of url routing 
router = DefaultRouter()
router.register(r'services', ServiceViewSet)


urlpatterns = [
    path('appointments/', AppointmentListView.as_view(), name='appointment-list'),
    path('appointments/<int:pk>/', AppointmentDetailView.as_view(), name='appointment-detail'),
    path('user/appointments/', AppointmentHistoryView.as_view(), name='appointment-history'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('', include(router.urls)),
]
