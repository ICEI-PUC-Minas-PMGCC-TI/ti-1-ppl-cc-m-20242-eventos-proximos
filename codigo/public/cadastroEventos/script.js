document.addEventListener('DOMContentLoaded', loadEvents);

document.getElementById('eventForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const evento = {
        id: parseInt(document.getElementById('id').value),
        nome: document.getElementById('nome').value,
        data: document.getElementById('data').value,
        descricao: document.getElementById('descricao').value,
        categoria: document.getElementById('categoria').value,
        endereco: {
            rua: document.getElementById('rua').value,
            numero: document.getElementById('numero').value,
            cidade: document.getElementById('cidade').value,
            estado: document.getElementById('estado').value,
            cep: document.getElementById('cep').value
        },
        status: "ativo",
        id_usuario: 1,
        imagem: document.getElementById('imagem').files[0] ? URL.createObjectURL(document.getElementById('imagem').files[0]) : null
    };

    saveEvent(evento);
});

function loadEvents() {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    displayEvents(events);
}

function saveEvent(event) {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    
    const existingIndex = events.findIndex(e => e.id === event.id);
    if (existingIndex !== -1) {
        const newImage = document.getElementById('imagem').files[0];
        if (newImage) {
            event.imagem = URL.createObjectURL(newImage);
        } else {
            event.imagem = events[existingIndex].imagem;
        }
        events[existingIndex] = event;
    } else {

        const newImage = document.getElementById('imagem').files[0];
        if (newImage) {
            event.imagem = URL.createObjectURL(newImage);
        }
        events.push(event);
    }

    localStorage.setItem('events', JSON.stringify(events));
    displayEvents(events);
    resetForm();
}

function displayEvents(events) {
    const eventList = document.getElementById('eventList');
    eventList.innerHTML = '';

    events.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.classList.add('event-item');
        eventItem.innerHTML = `
            <div class="event-details">
                <img src="${event.imagem}" alt="Imagem do Evento" class="event-image">
                <div class="event-info">
                    <strong>ID: ${event.id}</strong> - <strong>${event.nome}</strong> <br>
                    <em>${event.categoria}</em> | Data: ${event.data} <br>
                    <em>${event.descricao}</em>
                </div>
            </div>
            <div class="event-actions">
                <button class="edit-btn" onclick="editEvent(${event.id})">Editar</button>
                <button class="delete-btn" onclick="deleteEvent(${event.id})">Excluir</button>
                <a href="#" onclick="viewEventPage(${event.id})">Ver página do evento</a>
            </div>
        `;
        eventList.appendChild(eventItem);
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function editEvent(id) {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const event = events.find(e => e.id === id);
    if (event) {
        document.getElementById('id').value = event.id;
        document.getElementById('nome').value = event.nome;
        document.getElementById('data').value = event.data;
        document.getElementById('descricao').value = event.descricao;
        document.getElementById('categoria').value = event.categoria;

        document.getElementById('rua').value = event.endereco.rua;
        document.getElementById('numero').value = event.endereco.numero;
        document.getElementById('cidade').value = event.endereco.cidade;
        document.getElementById('estado').value = event.endereco.estado;
        document.getElementById('cep').value = event.endereco.cep;

        const imageContainer = document.getElementById('imageContainer');
        imageContainer.innerHTML = '';

        if (event.imagem) {
            const imagePreview = document.createElement('img');
            imagePreview.src = event.imagem;
            imagePreview.alt = "Imagem do Evento";
            imagePreview.classList.add('event-image');
            imagePreview.style.width = '100px';
            imagePreview.style.height = 'auto';
            imageContainer.appendChild(imagePreview);
        }
        scrollToTop();
    }
}

function deleteEvent(id) {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    events = events.filter(e => e.id !== id);
    localStorage.setItem('events', JSON.stringify(events));
    displayEvents(events);
}

function viewEventPage(id) {
    alert(`Exibindo a página do evento com ID: ${id}`);
}

function resetForm() {
    document.getElementById('eventForm').reset();
}
