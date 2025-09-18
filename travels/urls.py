from django.urls import path
from . import views
from django.contrib.auth.views import LoginView, LogoutView

app_name = 'travels'
urlpatterns = [
    path('', views.index, name='index'),
    path('flights/', views.flights, name='flights'),
    path('hotels/', views.hotels, name='hotels'),
    path('excursions/', views.excursions, name='excursions'),
    path('register/', views.register, name='register'),
    path('login/', LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', LogoutView.as_view(next_page='travels:index'), name='logout'),
    path('profile/', views.profile, name='profile'),
    path('cancel_booking/<int:booking_id>/', views.cancel_booking, name='cancel_booking'),
    path('api/search_flights/', views.search_flights, name='search_flights'),
    path('api/search_hotels/', views.search_hotels, name='search_hotels'),
    path('api/search_excursions/', views.search_excursions, name='search_excursions'),
    path('api/get_cities/', views.get_cities, name='get_cities'),
]