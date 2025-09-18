from django.shortcuts import render, redirect
from django.db import models
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from .models import Destination, Flight, Hotel, Excursion, Booking
from django.utils import timezone
from datetime import timedelta
from django.contrib.contenttypes.models import ContentType
from django.contrib import messages
from django.core.paginator import Paginator
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import serializers

# Serializers
class FlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = ['id', 'airline', 'from_city', 'to_city', 'departure_time', 'arrival_time', 'price', 'duration', 'direct']

class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = ['id', 'name', 'city', 'rating', 'price_per_night', 'accommodation_type']

class ExcursionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Excursion
        fields = ['id', 'name', 'city', 'type', 'theme', 'price', 'duration', 'language', 'schedule']

def index(request):
    destinations = Destination.objects.all()[:3]
    context = {
        'destinations': destinations
    }
    return render(request, 'index.html', context)

def flights(request):
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return redirect('travels:login')
        flight_id = request.POST.get('flight_id')
        participants = int(request.POST.get('participants', 1))
        flight = Flight.objects.get(id=flight_id)
        total_price = flight.price * participants
        Booking.objects.create(
            user=request.user,
            content_type=ContentType.objects.get_for_model(Flight),
            object_id=flight.id,
            participants=participants,
            total_price=total_price
        )
        return render(request, 'booking_confirmation.html', {
            'item': flight,
            'item_type': 'flight',
            'participants': participants,
            'total_price': total_price
        })

    from_city = request.GET.get('from_city', '')
    to_city = request.GET.get('to_city', '')
    depart_date = request.GET.get('depart_date', '')
    direct_flights = request.GET.get('direct_flights', False)
    budget = request.GET.get('budget', '')
    flights = Flight.objects.all()

    if from_city:
        flights = flights.filter(from_city__icontains=from_city)
    if to_city:
        flights = flights.filter(to_city__icontains=to_city)
    if depart_date:
        flights = flights.filter(departure_time__date=depart_date)
    if direct_flights:
        flights = flights.filter(direct=True)
    if budget:
        if budget == 'low':
            flights = flights.filter(price__lte=20000)
        elif budget == 'medium':
            flights = flights.filter(price__range=(20000, 40000))
        elif budget == 'high':
            flights = flights.filter(price__gte=40000)

    calendar_prices = []
    if depart_date:
        try:
            base_date = timezone.datetime.strptime(depart_date, '%Y-%m-%d').date()
            for i in range(-3, 4):
                date = base_date + timedelta(days=i)
                price = Flight.objects.filter(from_city__icontains=from_city, to_city__icontains=to_city, departure_time__date=date).aggregate(min_price=models.Min('price'))['min_price']
                calendar_prices.append({'date': date, 'price': price or '—'})
        except ValueError:
            pass

    context = {
        'flights': flights,
        'from_city': from_city,
        'to_city': to_city,
        'depart_date': depart_date,
        'calendar_prices': calendar_prices
    }
    return render(request, 'flights.html', context)

def hotels(request):
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return redirect('travels:login')
        hotel_id = request.POST.get('hotel_id')
        participants = int(request.POST.get('participants', 1))
        hotel = Hotel.objects.get(id=hotel_id)
        total_price = hotel.price_per_night * participants
        Booking.objects.create(
            user=request.user,
            content_type=ContentType.objects.get_for_model(Hotel),
            object_id=hotel.id,
            participants=participants,
            total_price=total_price
        )
        return render(request, 'booking_confirmation.html', {
            'item': hotel,
            'item_type': 'hotel',
            'participants': participants,
            'total_price': total_price
        })

    city = request.GET.get('to_city', '')
    depart_date = request.GET.get('depart_date', '')
    travelers = request.GET.get('travelers', 1)
    accommodation = request.GET.get('accommodation', '')
    hotels = Hotel.objects.all()

    if city:
        hotels = hotels.filter(city__icontains=city)
    if accommodation:
        hotels = hotels.filter(accommodation_type=accommodation)

    context = {
        'hotels': hotels,
        'city': city,
        'depart_date': depart_date,
        'travelers': travelers,
        'accommodation': accommodation
    }
    return render(request, 'hotels.html', context)

def excursions(request):
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return redirect('travels:login')
        excursion_id = request.POST.get('excursion_id')
        participants = int(request.POST.get('participants', 1))
        excursion = Excursion.objects.get(id=excursion_id)
        total_price = excursion.price * participants
        Booking.objects.create(
            user=request.user,
            content_type=ContentType.objects.get_for_model(Excursion),
            object_id=excursion.id,
            participants=participants,
            total_price=total_price
        )
        return render(request, 'booking_confirmation.html', {
            'item': excursion,
            'item_type': 'excursion',
            'participants': participants,
            'total_price': total_price
        })

    city = request.GET.get('to_city', '')
    depart_date = request.GET.get('depart_date', '')
    travelers = request.GET.get('travelers', 1)
    excursion_type = request.GET.get('excursion_type', '')
    theme = request.GET.get('theme', '')
    language = request.GET.get('language', '')
    excursions = Excursion.objects.all()

    if city:
        excursions = excursions.filter(city__icontains=city)
    if excursion_type:
        excursions = excursions.filter(type=excursion_type)
    if theme:
        excursions = excursions.filter(theme=theme)
    if language:
        excursions = excursions.filter(language=language)

    context = {
        'excursions': excursions,
        'city': city,
        'depart_date': depart_date,
        'travelers': travelers,
        'excursion_type': excursion_type,
        'theme': theme,
        'language': language
    }
    return render(request, 'excursions.html', context)

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('travels:profile')
    else:
        form = UserCreationForm()
    return render(request, 'register.html', {'form': form})

@login_required
def profile(request):
    bookings = Booking.objects.filter(user=request.user)
    booking_type = request.GET.get('booking_type', '')
    sort_by = request.GET.get('sort_by', 'created_at')

    if booking_type:
        bookings = bookings.filter(content_type=ContentType.objects.get(model=booking_type))

    if sort_by in ['created_at', '-created_at', 'total_price', '-total_price']:
        bookings = bookings.order_by(sort_by)

    paginator = Paginator(bookings, 5)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'page_obj': page_obj,
        'booking_type': booking_type,
        'sort_by': sort_by
    }
    return render(request, 'profile.html', context)

@login_required
def cancel_booking(request, booking_id):
    if request.method == 'POST':
        try:
            booking = Booking.objects.get(id=booking_id, user=request.user)
            booking.delete()
            messages.success(request, 'Бронирование успешно отменено.')
        except Booking.DoesNotExist:
            messages.error(request, 'Бронирование не найдено или вы не имеете к нему доступа.')
        return redirect('travels:profile')
    return redirect('travels:profile')

@api_view(['GET'])
def search_flights(request):
    from_city = request.GET.get('from_city', '')
    to_city = request.GET.get('to_city', '')
    depart_date = request.GET.get('depart_date', '')
    direct_flights = request.GET.get('direct_flights', 'false').lower() == 'true'
    budget = request.GET.get('budget', '')
    flights = Flight.objects.all()

    if from_city:
        flights = flights.filter(from_city__icontains=from_city)
    if to_city:
        flights = flights.filter(to_city__icontains=to_city)
    if depart_date:
        flights = flights.filter(departure_time__date=depart_date)
    if direct_flights:
        flights = flights.filter(direct=True)
    if budget:
        if budget == 'low':
            flights = flights.filter(price__lte=20000)
        elif budget == 'medium':
            flights = flights.filter(price__range=(20000, 40000))
        elif budget == 'high':
            flights = flights.filter(price__gte=40000)

    serializer = FlightSerializer(flights, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def search_hotels(request):
    city = request.GET.get('city', '')
    accommodation = request.GET.get('accommodation', '')
    hotels = Hotel.objects.all()

    if city:
        hotels = hotels.filter(city__icontains=city)
    if accommodation:
        hotels = hotels.filter(accommodation_type=accommodation)

    serializer = HotelSerializer(hotels, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def search_excursions(request):
    city = request.GET.get('city', '')
    excursion_type = request.GET.get('excursion_type', '')
    theme = request.GET.get('theme', '')
    language = request.GET.get('language', '')
    excursions = Excursion.objects.all()

    if city:
        excursions = excursions.filter(city__icontains=city)
    if excursion_type:
        excursions = excursions.filter(type=excursion_type)
    if theme:
        excursions = excursions.filter(theme=theme)
    if language:
        excursions = excursions.filter(language=language)

    serializer = ExcursionSerializer(excursions, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_cities(request):
    cities = list(set(Flight.objects.values_list('from_city', flat=True)) |
                  set(Flight.objects.values_list('to_city', flat=True)) |
                  set(Hotel.objects.values_list('city', flat=True)) |
                  set(Excursion.objects.values_list('city', flat=True)))
    return Response(cities)