document.addEventListener('DOMContentLoaded', function () {
  renderCalendar();
  loadEvents(); // Carrega e exibe os eventos salvos ao iniciar a página
});

function loadEvents() {
  const events = JSON.parse(localStorage.getItem('events')) || [];
  const eventList = document.getElementById('event-list');
  eventList.innerHTML = ''; // Limpa a lista antes de adicionar os eventos

  events.forEach((event) => {
    const eventElement = document.createElement('li');
    eventElement.innerHTML = `<strong>${event.nome}</strong><br>${event.descricao}<br><small>${event.data}</small>
      <button class="edit-button" onclick="editEvent(${event.id})">✏️ Editar</button>
      <button class="delete-button" onclick="deleteEvent(${event.id})">🗑️ Deletar</button>`;
    eventList.appendChild(eventElement);
  });
}

// Função para editar um evento
function editEvent(eventId) {
  const events = JSON.parse(localStorage.getItem('events')) || [];
  const event = events.find((e) => e.id === eventId);
  if (event) {
    console.log('Editando evento:', event); // Verifique se o evento está sendo encontrado corretamente

    // Preenche os campos do formulário com os dados do evento para edição
    document.getElementById('event-id').value = event.id; // Campo oculto para identificar o evento
    document.getElementById('event-name').value = event.nome;
    document.getElementById('event-date').value = event.data;
    document.getElementById('event-description').value = event.descricao;

    // Abre o modal para edição
    openEventModal();
  } else {
    console.log('Evento não encontrado para edição.');
  }
}

// Função para deletar um evento
function deleteEvent(eventId) {
  let events = JSON.parse(localStorage.getItem('events')) || [];
  events = events.filter((e) => e.id !== eventId); // Remove o evento da lista
  localStorage.setItem('events', JSON.stringify(events)); // Atualiza o localStorage

  loadEvents(); // Recarrega a lista de eventos após exclusão
}

// Função de submissão do formulário de evento (para criar e editar)
document.getElementById('event-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const eventId = document.getElementById('event-id').value;
  const eventDate = document.getElementById('event-date').value;
  const eventName = document.getElementById('event-name').value;
  const eventDescription = document.getElementById('event-description').value;

  // Verifica se é uma edição ou um novo evento
  const newEvent = {
    id: eventId ? parseInt(eventId) : Date.now(), // Garante que o id seja número
    nome: eventName,
    data: eventDate,
    descricao: eventDescription,
    confirmado: 'false',
  };

  let events = JSON.parse(localStorage.getItem('events')) || [];

  if (eventId) {
    // Edita o evento existente
    events = events.map((e) => (e.id === newEvent.id ? newEvent : e));
  } else {
    // Adiciona um novo evento
    events.push(newEvent);
  }

  localStorage.setItem('events', JSON.stringify(events)); // Atualiza o localStorage
  loadEvents(); // Recarrega a lista de eventos
  closeEventModal();
  document.getElementById('event-form').reset(); // Reseta o formulário após salvar
});

// Funções do modal
function openEventModal() {
  document.getElementById('event-modal').style.display = 'flex';
}

function closeEventModal() {
  document.getElementById('event-modal').style.display = 'none';
}

// Renderização do calendário
let currentDate = new Date();

function renderCalendar() {
  const calendarGrid = document.getElementById('calendar-grid');
  const monthYear = document.getElementById('calendar-month-year');

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
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
  calendarGrid.innerHTML = '';

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  for (let i = 0; i < firstDay.getDay(); i++) {
    const emptyDiv = document.createElement('div');
    calendarGrid.appendChild(emptyDiv);
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    const dayDiv = document.createElement('div');
    dayDiv.textContent = i;
    dayDiv.classList.add('calendar-day');
    dayDiv.addEventListener('click', () => showEventDetails(i));

    const events = JSON.parse(localStorage.getItem('events')) || [];
    events.forEach((event) => {
      const eventDate = new Date(event.data); // Converte para objeto Date
      if (
        eventDate.getDate() === i &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year
      ) {
        dayDiv.classList.add('event-day');
        dayDiv.title = `Evento: ${event.nome}\nDescrição: ${event.descricao}`;
      }
    });

    calendarGrid.appendChild(dayDiv);
  }
}

function showEventDetails(day) {
  console.log('Detalhes do evento para o dia:', day);
}
