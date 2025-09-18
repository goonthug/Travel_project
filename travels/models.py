from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

class Destination(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='destinations/', default='destinations/default.jpg')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Flight(models.Model):
    airline = models.CharField(max_length=100)
    from_city = models.CharField(max_length=100)
    to_city = models.CharField(max_length=100)
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.DurationField()
    direct = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.airline}: {self.from_city} -> {self.to_city}"

class Hotel(models.Model):
    name = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    rating = models.FloatField(default=0.0)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    accommodation_type = models.CharField(max_length=50, choices=[
        ('hotel', 'Отель'),
        ('hostel', 'Хостел'),
        ('apartment', 'Апартаменты')
    ])
    latitude = models.FloatField()
    longitude = models.FloatField()
    image = models.ImageField(upload_to='hotels/', default='hotels/default.jpg')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.city})"

class Excursion(models.Model):
    name = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    type = models.CharField(max_length=50, choices=[
        ('group', 'Групповая'),
        ('individual', 'Индивидуальная')
    ])
    theme = models.CharField(max_length=50, choices=[
        ('history', 'История'),
        ('nature', 'Природа'),
        ('gastronomy', 'Гастрономия')
    ])
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.DurationField()
    language = models.CharField(max_length=50, choices=[
        ('ru', 'Русский'),
        ('en', 'Английский'),
        ('fr', 'Французский')
    ])
    rating = models.FloatField(default=0.0)
    schedule = models.DateTimeField()
    image = models.ImageField(upload_to='excursions/', default='excursions/default.jpg')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.city})"

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    participants = models.PositiveIntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Бронирование {self.content_object} для {self.user}"