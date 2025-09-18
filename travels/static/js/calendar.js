document.addEventListener('DOMContentLoaded', () => {
    // Простая заглушка для интерактивности календаря (будет расширена позже)
    const days = document.querySelectorAll('.calendar-day');
    days.forEach(day => {
        day.addEventListener('click', () => {
            alert(`Выбрана дата: ${day.querySelector('span').textContent}`);
        });
    });
});