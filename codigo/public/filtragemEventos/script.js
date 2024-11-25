document.addEventListener('DOMContentLoaded', async function () {
    const categoryFiltersContainer = document.getElementById('category-filters');
    const eventsContainer = document.querySelector('.events');

    async function fetchData() {
        try {
            const response = await fetch('eventos.json');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Erro ao carregar os dados:", error);
            return null;
        }
    }

    function populateCategoryCheckboxes(categories) {
        categoryFiltersContainer.innerHTML = '';
        categories.forEach(category => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = category;
            checkbox.classList.add('category-filter');
            label.appendChild(checkbox);
            label.append(category);
            categoryFiltersContainer.appendChild(label);
        });
    }

    function displayEvents(events) {
        eventsContainer.innerHTML = '';
        events.forEach((event, index) => {
            const card = document.createElement('div');
            card.classList.add('event-card');

            if (index === 0 || index === 1) {
                const badge = document.createElement('div');
                badge.classList.add('top-badge');
                card.appendChild(badge);
            }

            card.innerHTML += `
                <div class="event-image" style="background-image: url('${event.imagem}');"></div>
                <h3>${event.nome}</h3>
                <p><strong>Data:</strong> ${event.data}</p>
                <p><strong>Local:</strong> ${event.local}</p>
                <div class="button-container">
                    <button>Ver Detalhes</button>
                </div>
            `;
            eventsContainer.appendChild(card);
        });
    }

    function updateEventDisplay(events) {
        const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked'))
            .map(checkbox => checkbox.value);
        const filteredEvents = events.filter(event =>
            selectedCategories.length === 0 || selectedCategories.includes(event.categoria)
        );
        displayEvents(filteredEvents);
    }

    const data = await fetchData();
    if (data) {
        const { eventos, categorias } = data;
        const sortedEvents = eventos.sort((a, b) => b.numero_acessos - a.numero_acessos);
        populateCategoryCheckboxes(categorias);
        displayEvents(sortedEvents);
        categoryFiltersContainer.addEventListener('change', () => updateEventDisplay(sortedEvents));
    }
});
