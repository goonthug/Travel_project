const { useState, useEffect } = React;

function SearchForm() {
    const [searchType, setSearchType] = useState('flights');
    const [fromCity, setFromCity] = useState('');
    const [toCity, setToCity] = useState('');
    const [departDate, setDepartDate] = useState('');
    const [travelers, setTravelers] = useState(1);
    const [directFlights, setDirectFlights] = useState(false);
    const [budget, setBudget] = useState('');
    const [accommodation, setAccommodation] = useState('');
    const [excursionType, setExcursionType] = useState('');
    const [theme, setTheme] = useState('');
    const [language, setLanguage] = useState('');
    const [cities, setCities] = useState([]);
    const [fromCitySuggestions, setFromCitySuggestions] = useState([]);
    const [toCitySuggestions, setToCitySuggestions] = useState([]);
    const [errors, setErrors] = useState({});

    // Fetch cities for autocomplete
    useEffect(() => {
        fetch('/api/get_cities/')
            .then(response => response.json())
            .then(data => setCities(data))
            .catch(error => console.error('Error fetching cities:', error));
    }, []);

    // Handle city input for autocomplete
    const handleCityInput = (value, type) => {
        const suggestions = cities.filter(city =>
            city.toLowerCase().includes(value.toLowerCase())
        );
        if (type === 'from') {
            setFromCity(value);
            setFromCitySuggestions(value ? suggestions : []);
        } else {
            setToCity(value);
            setToCitySuggestions(value ? suggestions : []);
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        if (!fromCity && searchType === 'flights') newErrors.fromCity = 'Укажите город отправления';
        if (!toCity) newErrors.toCity = 'Укажите город назначения';
        if (!departDate) newErrors.departDate = 'Укажите дату';
        if (travelers < 1) newErrors.travelers = 'Количество путешественников должно быть больше 0';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const params = new URLSearchParams({
            from_city: fromCity,
            to_city: toCity,
            depart_date: departDate,
            travelers,
            direct_flights: directFlights,
            budget,
            accommodation,
            excursion_type: excursionType,
            theme,
            language
        });
        const url = searchType === 'flights' ? `/flights/?${params}` :
                    searchType === 'hotels' ? `/hotels/?${params}` :
                    `/excursions/?${params}`;
        window.location.href = url;
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Поиск путешествий</h1>
            <div className="mb-4">
                <button
                    className={`px-4 py-2 mr-2 rounded ${searchType === 'flights' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setSearchType('flights')}
                >
                    Рейсы
                </button>
                <button
                    className={`px-4 py-2 mr-2 rounded ${searchType === 'hotels' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setSearchType('hotels')}
                >
                    Отели
                </button>
                <button
                    className={`px-4 py-2 rounded ${searchType === 'excursions' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setSearchType('excursions')}
                >
                    Экскурсии
                </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                {searchType === 'flights' && (
                    <div>
                        <label className="block mb-1">Откуда</label>
                        <input
                            type="text"
                            value={fromCity}
                            onChange={(e) => handleCityInput(e.target.value, 'from')}
                            className="w-full p-2 border rounded"
                            placeholder="Город отправления"
                        />
                        {fromCitySuggestions.length > 0 && (
                            <ul className="border rounded mt-1 max-h-40 overflow-y-auto">
                                {fromCitySuggestions.map(city => (
                                    <li
                                        key={city}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            setFromCity(city);
                                            setFromCitySuggestions([]);
                                        }}
                                    >
                                        {city}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {errors.fromCity && <p className="text-red-500 text-sm">{errors.fromCity}</p>}
                    </div>
                )}
                <div>
                    <label className="block mb-1">Куда</label>
                    <input
                        type="text"
                        value={toCity}
                        onChange={(e) => handleCityInput(e.target.value, 'to')}
                        className="w-full p-2 border rounded"
                        placeholder="Город назначения"
                    />
                    {toCitySuggestions.length > 0 && (
                        <ul className="border rounded mt-1 max-h-40 overflow-y-auto">
                            {toCitySuggestions.map(city => (
                                <li
                                    key={city}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setToCity(city);
                                        setToCitySuggestions([]);
                                    }}
                                >
                                    {city}
                                </li>
                            ))}
                        </ul>
                    )}
                    {errors.toCity && <p className="text-red-500 text-sm">{errors.toCity}</p>}
                </div>
                <div>
                    <label className="block mb-1">Дата</label>
                    <input
                        type="date"
                        value={departDate}
                        onChange={(e) => setDepartDate(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    {errors.departDate && <p className="text-red-500 text-sm">{errors.departDate}</p>}
                </div>
                <div>
                    <label className="block mb-1">Путешественники</label>
                    <input
                        type="number"
                        value={travelers}
                        onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
                        className="w-full p-2 border rounded"
                        min="1"
                    />
                    {errors.travelers && <p className="text-red-500 text-sm">{errors.travelers}</p>}
                </div>
                {searchType === 'flights' && (
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={directFlights}
                                onChange={(e) => setDirectFlights(e.target.checked)}
                                className="mr-2"
                            />
                            Прямые рейсы
                        </label>
                        <div>
                            <label className="block mb-1">Бюджет</label>
                            <select
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Любой бюджет</option>
                                <option value="low">Эконом</option>
                                <option value="medium">Средний</option>
                                <option value="high">Премиум</option>
                            </select>
                        </div>
                    </div>
                )}
                {searchType === 'hotels' && (
                    <div>
                        <label className="block mb-1">Тип размещения</label>
                        <select
                            value={accommodation}
                            onChange={(e) => setAccommodation(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Любой</option>
                            <option value="hotel">Отель</option>
                            <option value="hostel">Хостел</option>
                            <option value="apartment">Апартаменты</option>
                        </select>
                    </div>
                )}
                {searchType === 'excursions' && (
                    <div className="space-y-2">
                        <div>
                            <label className="block mb-1">Тип экскурсии</label>
                            <select
                                value={excursionType}
                                onChange={(e) => setExcursionType(e.target.value)}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Любой</option>
                                <option value="group">Групповая</option>
                                <option value="individual">Индивидуальная</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1">Тема</label>
                            <select
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Любая</option>
                                <option value="history">История</option>
                                <option value="nature">Природа</option>
                                <option value="gastronomy">Гастрономия</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1">Язык</label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Любой</option>
                                <option value="ru">Русский</option>
                                <option value="en">Английский</option>
                                <option value="fr">Французский</option>
                            </select>
                        </div>
                    </div>
                )}
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Найти
                </button>
            </form>
        </div>
    );
}

ReactDOM.render(<SearchForm />, document.getElementById('search-form'));