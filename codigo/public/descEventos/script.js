async function getEventIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function fetchEventDetails() {
  const eventId = await getEventIdFromUrl();
  if (!eventId) {
    console.error('ID do evento não encontrado na URL');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/eventos');
    const events = await response.json();

    const event = events.find((e) => e.id == eventId);

    if (!event) {
      console.error('Evento não encontrado');
      return;
    }

    const eventDetailsContainer = document.getElementById('event-details');
    eventDetailsContainer.innerHTML = `
          <div class="event-detail">
              <img src="${event.imagem}" alt="${event.nome}" class="event-image"> 
              <h2>${event.nome}</h2>
              <p class="event-date">Data: ${event.data}</p>
              <p class="event-location">Local: ${event.local}</p>
              <p class="event-description">Descrição: ${event.descricao}</p>
              <button id="confirm-button" class="btn-neutral" onclick="togglePresence(${event.id})">Confirmar presença</button>
          </div>
      `;

    const confirmed = event.confirmed || false; // Verifica se o evento já está confirmado
    if (confirmed) {
      setConfirmed();
    }
  } catch (error) {
    console.error('Erro ao buscar o evento:', error);
  }
}

async function togglePresence(eventId) {
  const button = document.getElementById('confirm-button');
  const isConfirmed = button.classList.contains('btn-confirmed');

  try {
    // Atualiza o status no servidor
    await fetch(`http://localhost:3000/eventos/${eventId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ confirmed: !isConfirmed }),
    });

    if (isConfirmed) {
      setNeutral();
    } else {
      setConfirmed();
    }
  } catch (error) {
    console.error('Erro ao confirmar presença:', error);
  }
}

function setConfirmed() {
  const button = document.getElementById('confirm-button');
  button.textContent = 'Confirmado';
  button.classList.remove('btn-neutral');
  button.classList.add('btn-confirmed');
}

function setNeutral() {
  const button = document.getElementById('confirm-button');
  button.textContent = 'Confirmar presença';
  button.classList.remove('btn-confirmed');
  button.classList.add('btn-neutral');
}

fetchEventDetails();

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
