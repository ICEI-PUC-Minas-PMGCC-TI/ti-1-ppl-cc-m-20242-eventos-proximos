document.addEventListener('DOMContentLoaded', async function () {
    const categoryFiltersContainer = document.getElementById('category-filters');
    const eventsContainer = document.querySelector('.events');
    const locationFilter = document.getElementById('locationFilter');

    async function fetchData() {
        try {
            const response = await fetch('../../db/db.json');
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
            checkbox.value = category.id;
            checkbox.classList.add('category-filter');
            label.appendChild(checkbox);
            label.append(category.tipo);
            categoryFiltersContainer.appendChild(label);
        });
    }

    function populateLocationFilter(locais, enderecos) {
        locationFilter.innerHTML = '<option value="">Todas as Localizações</option>';
        const uniqueCities = [...new Set(locais.map(local => {
            const endereco = enderecos.find(e => e.id.toString() === local.endereco_id.toString());
            return endereco ? endereco.cidade : null;
        }).filter(Boolean))];
        uniqueCities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            locationFilter.appendChild(option);
        });
    }

    function getCityByLocalId(localId, locais, enderecos) {
        const local = locais.find(local => local.id.toString() === localId.toString());
        if (!local) return null;
        const endereco = enderecos.find(e => e.id.toString() === local.endereco_id.toString());
        return endereco ? endereco.cidade : null;
    }

    function displayEvents(events, locais, enderecos) {
        eventsContainer.innerHTML = '';
        events.forEach((event, index) => {
            const cityName = getCityByLocalId(event.id_local, locais, enderecos);
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
                <p><strong>Local:</strong> ${cityName || 'Desconhecido'}</p>
                <div class="button-container">
                    <button>Ver Detalhes</button>
                </div>
            `;
            eventsContainer.appendChild(card);
        });
    }

    function updateEventDisplay(events, locais, enderecos) {
        const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked'))
            .map(checkbox => checkbox.value);
        const selectedCity = locationFilter.value;

        const filteredEvents = events.filter(event => {
            const eventCity = getCityByLocalId(event.id_local, locais, enderecos);
            return (
                (selectedCategories.length === 0 || selectedCategories.includes(event.id_categoria.toString())) &&
                (selectedCity === "" || eventCity === selectedCity)
            );
        });

        displayEvents(filteredEvents, locais, enderecos);
    }

    const data = await fetchData();
    if (data) {
        const { eventos, categorias, locais, enderecos } = data;
        const sortedEvents = eventos.sort((a, b) => b.numero_acessos - a.numero_acessos);
        populateCategoryCheckboxes(categorias);
        populateLocationFilter(locais, enderecos);
        displayEvents(sortedEvents, locais, enderecos);
        categoryFiltersContainer.addEventListener('change', () => {
            updateEventDisplay(sortedEvents, locais, enderecos);
        });
        locationFilter.addEventListener('change', () => {
            updateEventDisplay(sortedEvents, locais, enderecos);
        });
    }
});
