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
]