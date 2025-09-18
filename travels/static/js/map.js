document.addEventListener('DOMContentLoaded', () => {
    var map = L.map('map').setView([48.8566, 2.3522], 10); // Париж по умолчанию
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    hotels.forEach(hotel => {
        L.marker([hotel.lat, hotel.lng]).addTo(map)
            .bindPopup(hotel.name);
    });
});