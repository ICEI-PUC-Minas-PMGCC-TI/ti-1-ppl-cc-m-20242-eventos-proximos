const calendarGrid = document.getElementById('calendar-grid');
const monthYearSelect = document.getElementById('month-year-select');
const favoriteEventsContainer = document.getElementById('favorite-events');
const daysOfWeekContainer = document.getElementById('days-of-week');

let favoriteDays = [];  
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let data;

fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;
        initCalendar();
    })
    .catch(error => console.error('Erro ao carregar data.json:', error));

function initCalendar() {
    generateDaysOfWeek();
    generateMonthYearOptions();
    generateCalendar(currentMonth, currentYear);
}

function generateDaysOfWeek() {
    daysOfWeekContainer.innerHTML = '';
    data.dias_da_semana.forEach(dia => {
        const dayElement = document.createElement('div');
        dayElement.textContent = dia.abreviacao;
        daysOfWeekContainer.appendChild(dayElement);
    });
}

function generateMonthYearOptions() {
    monthYearSelect.innerHTML = '';
    for (let year = 2023; year <= 2050; year++) {
        data.meses.forEach((mes, month) => {
            const option = document.createElement('option');
            option.value = `${month}-${year}`;
            option.text = `${mes.nome} ${year}`;
            if (year === currentYear && month === currentMonth) {
                option.selected = true;
            }
            monthYearSelect.appendChild(option);
        });
    }
}

function generateCalendar(month, year) {
    calendarGrid.innerHTML = '';
    const daysInMonth = getDaysInMonth(month, year);
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('day');
        calendarGrid.appendChild(emptyDay);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = day;

        const starElement = document.createElement('span');
        starElement.classList.add('star');
        starElement.innerHTML = '★';
        starElement.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(day, month, year, dayElement);
        });
        dayElement.appendChild(starElement);

        if (isFavorite(day, month, year)) {
            dayElement.classList.add('favorite');
            starElement.classList.add('favorite-star');
        }

        calendarGrid.appendChild(dayElement);
    }
}

function getDaysInMonth(month, year) {
    if (month === 1) {
        return isLeapYear(year) ? 29 : 28;
    }
    return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function toggleFavorite(day, month, year, dayElement) {
    const favoriteIndex = favoriteDays.findIndex(
        d => d.day === day && d.month === month && d.year === year
    );

    if (favoriteIndex === -1) {
        favoriteDays.push({ day, month, year });
        dayElement.classList.add('favorite');
        updateFavoriteSidebar();
    } else {
        favoriteDays.splice(favoriteIndex, 1);
        dayElement.classList.remove('favorite');
        updateFavoriteSidebar();
    }
}

function isFavorite(day, month, year) {
    return favoriteDays.some(d => d.day === day && d.month === month && d.year === year);
}

function updateFavoriteSidebar() {
    favoriteEventsContainer.innerHTML = '';  
    favoriteDays.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.classList.add('event-item');
        eventElement.innerHTML = `<p>${event.day} ${data.meses[event.month].nome} - ${event.year}</p>`;
        favoriteEventsContainer.appendChild(eventElement);
    });
}

function selectMonthYear() {
    const [month, year] = monthYearSelect.value.split('-').map(Number);
    currentMonth = month;
    currentYear = year;
    generateCalendar(currentMonth, currentYear);
}
