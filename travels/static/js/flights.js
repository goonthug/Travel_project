const { useState, useEffect } = React;

function Flights() {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [participants, setParticipants] = useState(1);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const flightsPerPage = 5;

    // Parse URL parameters
    const params = new URLSearchParams(window.location.search);
    const fromCity = params.get('from_city') || '';
    const toCity = params.get('to_city') || '';
    const departDate = params.get('depart_date') || '';
    const directFlights = params.get('direct_flights') === 'true';
    const budget = params.get('budget') || '';

    // Check authentication
    useEffect(() => {
        fetch('/api/get_cities/', { credentials: 'include' })
            .then(response => {
                if (response.ok) setIsAuthenticated(true);
                else setIsAuthenticated(false);
            })
            .catch(() => setIsAuthenticated(false));
    }, []);

    // Fetch flights
    useEffect(() => {
        setLoading(true);
        const query = new URLSearchParams({
            from_city: fromCity,
            to_city: toCity,
            depart_date: departDate,
            direct_flights: directFlights,
            budget: budget
        }).toString();
        fetch(`/api/search_flights/?${query}`)
            .then(response => {
                if (!response.ok) throw new Error('Ошибка загрузки рейсов');
                return response.json();
            })
            .then(data => {
                setFlights(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [fromCity, toCity, departDate, directFlights, budget]);

    // Handle booking
    const handleBooking = (flightId) => {
        if (!isAuthenticated) {
            window.location.href = '/login/';
            return;
        }
        if (participants < 1) {
            alert('Количество путешественников должно быть больше 0');
            return;
        }
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/flights/';
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
        form.innerHTML = `
            <input type="hidden" name="csrfmiddlewaretoken" value="${csrfToken}">
            <input type="hidden" name="flight_id" value="${flightId}">
            <input type="hidden" name="participants" value="${participants}">
        `;
        document.body.appendChild(form);
        form.submit();
    };

    // Pagination
    const indexOfLastFlight = currentPage * flightsPerPage;
    const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
    const currentFlights = flights.slice(indexOfFirstFlight, indexOfLastFlight);
    const totalPages = Math.ceil(flights.length / flightsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Рейсы</h1>
            {loading && <p>Загрузка...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
                <div>
                    <div className="mb-4">
                        <label className="block mb-1">Путешественники</label>
                        <input
                            type="number"
                            value={participants}
                            onChange={(e) => setParticipants(parseInt(e.target.value) || 1)}
                            className="w-full p-2 border rounded"
                            min="1"
                        />
                    </div>
                    {currentFlights.length === 0 ? (
                        <p>Рейсы не найдены.</p>
                    ) : (
                        <div className="space-y-4">
                            {currentFlights.map(flight => (
                                <div key={flight.id} className="border rounded p-4">
                                    <h3 className="text-lg font-semibold">{flight.airline}: {flight.from_city} → {flight.to_city}</h3>
                                    <p>Вылет: {new Date(flight.departure_time).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' })}</p>
                                    <p>Прибытие: {new Date(flight.arrival_time).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' })}</p>
                                    <p>Цена: {flight.price} ₽</p>
                                    <p>Продолжительность: {flight.duration}</p>
                                    <p>{flight.direct ? 'Прямой' : 'С пересадкой'}</p>
                                    <button
                                        onClick={() => handleBooking(flight.id)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2"
                                    >
                                        Забронировать
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-4">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => paginate(page)}
                                    className={`px-4 py-2 rounded ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

ReactDOM.render(<Flights />, document.getElementById('flights-container'));