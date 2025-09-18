from django.contrib import admin
from .models import Destination, Flight, Hotel, Excursion, Booking

admin.site.register(Destination)
admin.site.register(Flight)
admin.site.register(Hotel)
admin.site.register(Excursion)
admin.site.register(Booking)