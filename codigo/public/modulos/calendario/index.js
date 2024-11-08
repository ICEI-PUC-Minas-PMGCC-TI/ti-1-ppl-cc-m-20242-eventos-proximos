let currentDate = new Date();

function renderCalendar() {
  const calendarGrid = document.getElementById('calendar-grid');
  const monthYear = document.getElementById('calendar-month-year');

  // Get the current month and year
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  // Update the month-year label
  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  monthYear.textContent = `${months[month]} ${year}`;

  // Clear the calendar grid
  calendarGrid.innerHTML = '';

  // Get the first day of the month
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Add empty spaces for the first week
  for (let i = 0; i < firstDay.getDay(); i++) {
    const emptyDiv = document.createElement('div');
    calendarGrid.appendChild(emptyDiv);
  }

  // Add days of the month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const dayDiv = document.createElement('div');
    dayDiv.textContent = i;
    dayDiv.classList.add('calendar-day');
    dayDiv.addEventListener('click', () => showEventDetails(i));

    // Check if there is a confirmed event for this day
    const events = JSON.parse(localStorage.getItem('events')) || [];
    events.forEach(event => {
      const eventDate = new Date(event.data);
      // Check if the event is confirmed and matches the day, month, and year
      if (eventDate.getDate() === i &&
          eventDate.getMonth() === month &&
          eventDate.getFullYear() === year &&
          event.confirmado === 'true') {
        // Highlight the confirmed event date
        dayDiv.style.backgroundColor = 'lightgreen'; // Highlight confirmed events
        dayDiv.title = `Evento: ${event.nome}\nDescrição: ${event.descricao}`; // Add tooltip with event details
      }
    });

    calendarGrid.appendChild(dayDiv);
  }
}

function showEventDetails(day) {
  alert(`Detalhes do evento para o dia ${day}`);
}

function openEventModal() {
  document.getElementById('event-modal').style.display = 'flex';
}

function closeEventModal() {
  document.getElementById('event-modal').style.display = 'none';
}

// Event Form Submission
document.getElementById('event-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const eventDate = document.getElementById('event-date').value;
  const eventName = document.getElementById('event-name').value;
  const eventDescription = document.getElementById('event-description').value;

  // Create new event object
  const newEvent = {
    id: Date.now(), // Unique ID
    nome: eventName,
    data: eventDate,
    descricao: eventDescription,
    confirmado: 'false', // By default, set to false. You can change it when confirmed
  };

  // Save to localStorage
  const events = JSON.parse(localStorage.getItem('events')) || [];
  events.push(newEvent);
  localStorage.setItem('events', JSON.stringify(events));

  // Add new event to the event list
  const eventList = document.getElementById('event-list');
  const newEventElement = document.createElement('li');
  newEventElement.innerHTML = `<strong>${eventName}</strong><br>${eventDescription}<br><small>${eventDate}</small>`;
  eventList.appendChild(newEventElement);

  closeEventModal();
});

// Navigation Buttons
document.getElementById('prev-month').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

renderCalendar();
