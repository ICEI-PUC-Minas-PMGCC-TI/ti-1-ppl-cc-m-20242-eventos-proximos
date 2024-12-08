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
let confirmedEvents = []; // Array para armazenar eventos confirmados do usuário
let eventos = []; // Array para armazenar todos os eventos

async function fetchData() {
  try {
    const endpoints = [
      'meses',
      'dias_da_semana',
      'anos',
      'feriados',
      `usuarios/${userId}`,
      'confirmacao', // Endpoint para confirmar presença nos eventos
      'eventos', // Endpoint para buscar todos os eventos
    ];

    const responses = await Promise.all(
      endpoints.map((endpoint) => fetch(`${baseUrl}/${endpoint}`)),
    );

    if (responses.some((res) => !res.ok)) {
      throw new Error('Erro ao carregar dados do JSON Server');
    }

    [meses, diasDaSemana, anos, feriados, favoriteDays, confirmedEvents, eventos] =
      await Promise.all(
        responses.map((res, idx) =>
          idx === 4
            ? res.json().then((user) => user.favoritos || [])
            : idx === 5
            ? res
                .json()
                .then((confirmations) =>
                  confirmations.filter(
                    (c) => c.id_usuario === userId && c.confirmed,
                  ),
                )
            : idx === 6
            ? res.json()
            : res.json(),
        ),
      );

    await renderCalendarAndSidebar();
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
}

async function renderCalendarAndSidebar() {
  renderDaysOfWeek();
  renderCalendarWithAnimation(currentMonth, currentYear);
  populateMonthYearSelect();
  await updateFavoriteSidebar(); // Adicionamos o `await` para garantir a resolução
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

  const currentDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(
    day,
  ).padStart(2, '0')}`;
  const holiday = feriados.find((feriado) => feriado.data === currentDate);
  const isEventConfirmed = confirmedEvents.some(
    (event) => event.id_evento === currentDate,
  );

  if (holiday) {
    const holidayElement = document.createElement('div');
    holidayElement.classList.add('holiday');
    holidayElement.textContent = holiday.nome;
    dayElement.appendChild(holidayElement);
  }

  if (isEventConfirmed) {
    dayElement.classList.add('event-confirmed');
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
  return favoriteDays.some(
    (f) => f.day === day && f.month === month && f.year === year,
  );
}

async function toggleFavorite(day, month, year, dayElement) {
  const favoriteIndex = favoriteDays.findIndex(
    (f) => f.day === day && f.month === month && f.year === year,
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
      body: JSON.stringify({ favoritos: favoriteDays }),
    });
  } catch (error) {
    console.error('Erro ao salvar favoritos:', error);
  }
}

async function getEventDateById(eventId) {
  // Find the event in the 'eventos' array with the matching 'id_evento'
  const event = eventos.find((e) => e.id === eventId);
  if (event) {
    return event.data;
  } else {
    console.error('Evento não encontrado');
    return null;
  }
}

// Atualize a função `updateFavoriteSidebar` para incluir a data do evento
async function updateFavoriteSidebar() {
  favoriteEventsContainer.innerHTML = '';
  const sortedConfirmedEvents = confirmedEvents.sort(
    (a, b) => a.id_evento - b.id_evento,
  );

  const fragment = document.createDocumentFragment();
  for (const confirmation of sortedConfirmedEvents) {
    // Obter o nome e a data do evento
    const eventDate = await getEventDateById(confirmation.id_evento);
    if (eventDate) {
      const event = eventos.find((e) => e.id === confirmation.id_evento);
      if (event) {
        const eventElement = document.createElement('div');
        eventElement.classList.add('event-item');
        eventElement.textContent = `Evento: ${event.nome} - Data: ${eventDate}`;
        fragment.appendChild(eventElement);
      }
    }
  }

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
  const [selectedMonth, selectedYear] = monthYearSelect.value
    .split('-')
    .map(Number);

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
    const response = await fetch(`${baseUrl}/usuarios/${userId}`);
    if (response.ok) {
      const user = await response.json();
      document.getElementById('user-name').textContent = user.nome;
    } else {
      throw new Error('Erro ao buscar nome do usuário');
    }
  } catch (error) {
    console.error('Erro ao buscar nome do usuário:', error);
  }
}

// Call fetchData and initialize the calendar
fetchData().then(() => {
  initCalendar();
  fetchUserName();
});
