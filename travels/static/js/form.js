document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const fromCityGroup = document.getElementById('from-city-group');
    const flightFilters = document.querySelectorAll('.flight-only');
    const hotelFilters = document.querySelectorAll('.hotel-only');
    const excursionFilters = document.querySelectorAll('.excursion-only');
    const searchTypeRadios = document.querySelectorAll('input[name="search_type"]');

    function updateForm() {
        const searchType = document.querySelector('input[name="search_type"]:checked').value;
        if (searchType === 'flights') {
            form.action = '/flights/';
            fromCityGroup.style.display = 'block';
            fromCityGroup.querySelector('input').required = true;
            flightFilters.forEach(filter => filter.style.display = 'inline-block');
            hotelFilters.forEach(filter => filter.style.display = 'none');
            excursionFilters.forEach(filter => filter.style.display = 'none');
        } else if (searchType === 'hotels') {
            form.action = '/hotels/';
            fromCityGroup.style.display = 'none';
            fromCityGroup.querySelector('input').required = false;
            flightFilters.forEach(filter => filter.style.display = 'none');
            hotelFilters.forEach(filter => filter.style.display = 'inline-block');
            excursionFilters.forEach(filter => filter.style.display = 'none');
        } else if (searchType === 'excursions') {
            form.action = '/excursions/';
            fromCityGroup.style.display = 'none';
            fromCityGroup.querySelector('input').required = false;
            flightFilters.forEach(filter => filter.style.display = 'none');
            hotelFilters.forEach(filter => filter.style.display = 'none');
            excursionFilters.forEach(filter => filter.style.display = 'inline-block');
        }
    }

    searchTypeRadios.forEach(radio => {
        radio.addEventListener('change', updateForm);
    });

    updateForm(); // Инициализация формы
});