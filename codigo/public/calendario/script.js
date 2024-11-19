const calendarGrid = document.getElementById('calendar-grid');
const monthYearSelect = document.getElementById('month-year-select');
const favoriteEventsContainer = document.getElementById('favorite-events');
const daysOfWeekContainer = document.getElementById('days-of-week');

let favoriteDays = [];
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let data;
let events = []; // Armazenará os eventos do servidor

// Carrega dados iniciais e eventos confirmados
fetch('../../db/db.json')
  .then((response) => response.json())
  .then((jsonData) => {
    data = jsonData;
    fetchConfirmedEvents(); // Busca eventos confirmados
  })
  .catch((error) => console.error('Erro ao carregar db.json:', error));

function fetchConfirmedEvents() {
  fetch('http://localhost:3000/eventos') // Altere para a URL do JSON Server
    .then((response) => response.json())
    .then((jsonEvents) => {
      events = jsonEvents.filter((event) => event.confirmed); // Apenas eventos confirmados
      initCalendar();
    })
    .catch((error) => console.error('Erro ao carregar eventos:', error));
}

function initCalendar() {
  generateDaysOfWeek();
  generateMonthYearOptions();
  generateCalendar(currentMonth, currentYear);
}

function generateDaysOfWeek() {
  daysOfWeekContainer.innerHTML = '';
  data.dias_da_semana.forEach((dia) => {
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

    // Adiciona estrela de favoritos
    const starElement = document.createElement('span');
    starElement.classList.add('star');
    starElement.innerHTML = '★';
    starElement.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(day, month, year, dayElement);
    });
    dayElement.appendChild(starElement);

    // Verifica se é favorito
    if (isFavorite(day, month, year)) {
      dayElement.classList.add('favorite');
      starElement.classList.add('favorite-star');
    }

    // Adiciona evento confirmado se houver
    const event = events.find((ev) => isEventOnDate(ev, day, month, year));
    if (event) {
      const eventElement = document.createElement('div');
      eventElement.classList.add('event');
      eventElement.textContent = event.nome;
      dayElement.appendChild(eventElement);
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
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function toggleFavorite(day, month, year, dayElement) {
  const favoriteIndex = favoriteDays.findIndex(
    (d) => d.day === day && d.month === month && d.year === year,
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
  return favoriteDays.some(
    (d) => d.day === day && d.month === month && d.year === year,
  );
}

function updateFavoriteSidebar() {
  favoriteEventsContainer.innerHTML = '';
  favoriteDays.forEach((favorite) => {
    // Encontra o evento confirmado correspondente à data favorita
    const event = events.find((ev) =>
      isEventOnDate(ev, favorite.day, favorite.month, favorite.year),
    );

    // Cria o elemento de exibição
    const eventElement = document.createElement('div');
    eventElement.classList.add('event-item');

    if (event) {
      // Se há um evento na data favorita, exibe nome e data
      eventElement.innerHTML = `
          <p><strong>${event.nome}</strong></p>
          <p>${favorite.day} ${data.meses[favorite.month].nome} - ${
        favorite.year
      }</p>
        `;
    } else {
      // Caso contrário, exibe apenas a data favorita
      eventElement.innerHTML = `
          <p>${favorite.day} ${data.meses[favorite.month].nome} - ${
        favorite.year
      }</p>
        `;
    }

    favoriteEventsContainer.appendChild(eventElement);
  });
}

function selectMonthYear() {
  const [month, year] = monthYearSelect.value.split('-').map(Number);
  currentMonth = month;
  currentYear = year;
  generateCalendar(currentMonth, currentYear);
}

function isEventOnDate(event, day, month, year) {
  const [eventDay, eventMonth, eventYear] = event.data.split('-').map(Number);
  return eventDay === day && eventMonth - 1 === month && eventYear === year;
}
