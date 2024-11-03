document.addEventListener('DOMContentLoaded', async function () {
    const locationFilter = document.getElementById('locationFilter');
    const searchInput = document.getElementById('searchInput');
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

    function getCity(location) {
        return location.split(" - ")[0];
    }

    function populateLocationOptions(events) {
        const uniqueCities = [...new Set(events.map(event => getCity(event.local)))];
        locationFilter.innerHTML = '<option value="">Onde encontrar</option>';

        uniqueCities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.toLowerCase().replace(/\s+/g, "_");
            option.textContent = city;
            locationFilter.appendChild(option);
        });
    }

    function populateCategoryCheckboxes(categories) {
        categoryFiltersContainer.innerHTML = '';

        categories.forEach(category => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = category.toLowerCase();
            checkbox.classList.add('category-filter');
            label.appendChild(checkbox);
            label.append(category);
            categoryFiltersContainer.appendChild(label);
        });
    }

    function displayEvents(events) {
        eventsContainer.innerHTML = ''; 
        events.forEach(event => {
            const city = getCity(event.local);
            const card = document.createElement('div');
            card.classList.add('event-card');
            card.setAttribute('data-category', event.categoria.toLowerCase());
            card.setAttribute('data-location', city.toLowerCase().replace(/\s+/g, "_"));
            card.setAttribute('data-name', event.nome.toLowerCase());

            card.innerHTML = `
                <div class="event-image" style="background-image: url('${event.imagem}');"></div>
                <h3>${event.nome}</h3>
                <p><strong>Data:</strong> ${event.data}</p>
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
        const selectedLocation = locationFilter.value;
        const searchText = searchInput.value.toLowerCase();

        const filteredEvents = events.filter(event => {
            const city = getCity(event.local);
            const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(event.categoria.toLowerCase());
            const locationMatch = !selectedLocation || city.toLowerCase().replace(/\s+/g, "_") === selectedLocation;
            const searchMatch = event.nome.toLowerCase().includes(searchText);
            return categoryMatch && locationMatch && searchMatch;
        });

        displayEvents(filteredEvents);
    }

    const data = await fetchData();
    if (data) {
        const { eventos, categorias } = data;
        populateLocationOptions(eventos);
        populateCategoryCheckboxes(categorias);
        displayEvents(eventos);

        locationFilter.addEventListener('change', () => updateEventDisplay(eventos));
        searchInput.addEventListener('input', () => updateEventDisplay(eventos));
        categoryFiltersContainer.addEventListener('change', () => updateEventDisplay(eventos));
    }
});
