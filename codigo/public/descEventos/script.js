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
        <p class="event-location">Local: ${event.id_local}</p>
        <p class="event-description">Descrição: ${event.descricao}</p>
        <button id="confirm-button" class="btn-neutral" onclick="togglePresence(${event.id})">Confirmar presença</button>
      </div>
    `;

    // Verificar se o usuário já confirmou a presença
    const confirmationResponse = await fetch(
      'http://localhost:3000/confirmacao',
    );
    const confirmations = await confirmationResponse.json();
    const userConfirmed = confirmations.find(
      (c) => c.id_evento == eventId && c.id_usuario == 1, // Substitua pelo ID do usuário atual
    );

    if (userConfirmed) {
      if (userConfirmed.confirmed) {
        setConfirmed();
      } else {
        setNeutral();
      }
    } else {
      setNeutral();
    }
  } catch (error) {
    console.error('Erro ao buscar o evento:', error);
  }
}

async function togglePresence(eventId) {
  const button = document.getElementById('confirm-button');
  const isConfirmed = button.classList.contains('btn-confirmed');

  try {
    // Obter confirmações atuais do servidor
    const confirmationResponse = await fetch(
      'http://localhost:3000/confirmacao',
    );
    const confirmations = await confirmationResponse.json();
    const confirmation = confirmations.find(
      (c) => c.id_evento == eventId && c.id_usuario == 1, // Substitua pelo ID do usuário atual
    );

    if (confirmation) {
      // Atualizar a confirmação existente para o status alternado
      const newStatus = !confirmation.confirmed;
      await fetch(`http://localhost:3000/confirmacao/${confirmation.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ confirmed: newStatus }),
      });

      // Atualizar a interface do usuário com base no status de confirmação
      if (newStatus) {
        setConfirmed();
      } else {
        setNeutral();
      }
    } else {
      // Criar uma nova confirmação se não existir
      const confirmationResponse = await fetch(
        'http://localhost:3000/confirmacao',
      );
      const confirmations = await confirmationResponse.json();

      // Obter o próximo ID sequencial
      const nextId =
        confirmations.length > 0
          ? Math.max(...confirmations.map((c) => c.id)) + 1
          : 1;

      await fetch('http://localhost:3000/confirmacao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: nextId,
          id_usuario: 1, // Substitua pelo ID do usuário atual
          id_evento: eventId,
          confirmed: true, // Sempre marca como confirmado quando criado
        }),
      });
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

// Chama a função para buscar os detalhes do evento
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
