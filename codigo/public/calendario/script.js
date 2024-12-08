const baseUrl = 'http://localhost:3000';
const calendarGrid = document.getElementById('calendar-grid');
const monthYearSelect = document.getElementById('month-year-select');
const daysOfWeekContainer = document.getElementById('days-of-week');
const favoriteEventsContainer = document.getElementById('favorite-events');

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let favoriteDays = [];
let feriados = [];
let meses = [];
let diasDaSemana = [];
let anos = [];
let userId = 1;
let saveTimeout = null;

async function fetchData() {
    try {
        const endpoints = [
            'meses',
            'dias_da_semana',
            'anos',
            'feriados',
            `usuarios/${userId}`
        ];

        const responses = await Promise.all(
            endpoints.map((endpoint) => fetch(`${baseUrl}/${endpoint}`))
        );

        if (responses.some((res) => !res.ok)) {
            throw new Error('Erro ao carregar dados do JSON Server');
        }

        [meses, diasDaSemana, anos, feriados, favoriteDays] = await Promise.all(
            responses.map((res, idx) => (idx === 4 ? res.json().then((user) => user.favoritos || []) : res.json()))
        );

        initCalendar();
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

function renderDaysOfWeek() {
    const fragment = document.createDocumentFragment();
    diasDaSemana.forEach((dia) => {
        const dayElement = document.createElement('div');
        dayElement.textContent = dia.abreviacao;
        dayElement.classList.add('day-header');
        fragment.appendChild(dayElement);
    });
    daysOfWeekContainer.innerHTML = '';
    daysOfWeekContainer.appendChild(fragment);
}

function renderCalendarWithAnimation(month, year) {
    calendarGrid.style.opacity = 0;
    setTimeout(() => {
        renderCalendar(month, year);
        calendarGrid.style.transition = 'opacity 0.5s ease';
        calendarGrid.style.opacity = 1;
    }, 200);
}

function renderCalendar(month, year) {
    const selectedMonth = meses[month];
    if (!selectedMonth) {
        console.error(`Mês inválido: ${month}`);
        return;
    }

    const fragment = document.createDocumentFragment();
    const daysInMonth = selectedMonth.numero_dias;
    const firstDay = new Date(year, month, 1).getDay();

    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('day', 'empty');
        fragment.appendChild(emptyDay);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = createDayElement(day, month, year);
        fragment.appendChild(dayElement);
    }

    calendarGrid.innerHTML = '';
    calendarGrid.appendChild(fragment);

    updateMonthYearHeader(month, year);
}

function createDayElement(day, month, year) {
    const dayElement = document.createElement('div');
    dayElement.classList.add('day');
    dayElement.textContent = day;

    const currentDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const holiday = feriados.find((feriado) => feriado.data === currentDate);

    if (holiday) {
        const holidayElement = document.createElement('div');
        holidayElement.classList.add('holiday');
        holidayElement.textContent = holiday.nome;
        dayElement.appendChild(holidayElement);
    }

    if (isFavorite(day, month, year)) {
        dayElement.classList.add('favorite');
    }

    dayElement.addEventListener('click', (e) => {
        e.preventDefault();
        toggleFavorite(day, month, year, dayElement);
    });
    return dayElement;
}

function isFavorite(day, month, year) {
    return favoriteDays.some((f) => f.day === day && f.month === month && f.year === year);
}

async function toggleFavorite(day, month, year, dayElement) {
    const favoriteIndex = favoriteDays.findIndex(
        (f) => f.day === day && f.month === month && f.year === year
    );

    if (favoriteIndex === -1) {
        favoriteDays.push({ day, month, year });
        dayElement.classList.add('favorite');
    } else {
        favoriteDays.splice(favoriteIndex, 1);
        dayElement.classList.remove('favorite');
    }

    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveFavorites, 1000);
    updateFavoriteSidebar();
}

async function saveFavorites() {
    try {
        await fetch(`${baseUrl}/usuarios/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ favoritos: favoriteDays })
        });
    } catch (error) {
        console.error('Erro ao salvar favoritos:', error);
    }
}

function updateFavoriteSidebar() {
    favoriteEventsContainer.innerHTML = '';
    const sortedFavorites = [...favoriteDays].sort(
        (a, b) => new Date(a.year, a.month, a.day) - new Date(b.year, b.month, b.day)
    );

    const fragment = document.createDocumentFragment();
    sortedFavorites.forEach((favorite) => {
        const eventElement = document.createElement('div');
        eventElement.classList.add('event-item');
        eventElement.textContent = `Dia ${favorite.day}, ${meses[favorite.month].nome} ${favorite.year}`;
        fragment.appendChild(eventElement);
    });

    favoriteEventsContainer.appendChild(fragment);
}

function populateMonthYearSelect() {
    monthYearSelect.innerHTML = '';
    const fragment = document.createDocumentFragment();

    anos.forEach((ano) => {
        meses.forEach((mes, index) => {
            const option = document.createElement('option');
            option.value = `${index}-${ano.ano}`;
            option.text = `${mes.nome} ${ano.ano}`;
            if (ano.ano === currentYear && index === currentMonth) {
                option.selected = true;
            }
            fragment.appendChild(option);
        });
    });

    monthYearSelect.appendChild(fragment);
}

function selectMonthYear() {
    const [selectedMonth, selectedYear] = monthYearSelect.value.split('-').map(Number);

    if (!meses[selectedMonth] || !anos.some((a) => a.ano === selectedYear)) {
        console.error(`Mês ou ano inválido: ${selectedMonth}, ${selectedYear}`);
        return;
    }

    currentMonth = selectedMonth;
    currentYear = selectedYear;

    renderCalendarWithAnimation(currentMonth, currentYear);
    updateFavoriteSidebar();
}

function updateMonthYearHeader(month, year) {
    const header = document.getElementById('month-year');
    header.textContent = `${meses[month].nome} ${year}`;
}

function initCalendar() {
    renderDaysOfWeek();
    renderCalendarWithAnimation(currentMonth, currentYear);
    populateMonthYearSelect();
    updateFavoriteSidebar();

    monthYearSelect.addEventListener('change', selectMonthYear);
}

async function fetchUserName() {
    try {
        const response = await fetch("http://localhost:3000/usuarios"); 
        const data = await response.json();
  
        if (data.length > 0) { 
            const userName = data[0].nome; 
            document.getElementById('user-name').textContent = `Olá, ${userName}`;
        } else {
            console.warn('Nenhum usuário encontrado');
        }
    } catch (error) {
        console.error('Erro ao buscar o nome do usuário:', error);
    }
}

fetchUserName();

document.addEventListener('DOMContentLoaded', fetchData);
