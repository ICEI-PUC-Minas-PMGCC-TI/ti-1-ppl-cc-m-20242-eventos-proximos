document.addEventListener('DOMContentLoaded', function () {
    const typeFilters = document.querySelectorAll('.type-filter');
    const locationFilter = document.getElementById('locationFilter');
    const searchInput = document.getElementById('searchInput');
    const eventCards = document.querySelectorAll('.event-card');

    function updateEventDisplay() {
        const selectedTypes = Array.from(typeFilters)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        const selectedLocation = locationFilter.value;
        const searchText = searchInput.value.toLowerCase();

        eventCards.forEach(card => {
            const eventType = card.getAttribute('data-category');
            const eventLocation = card.getAttribute('data-location');
            const eventName = card.getAttribute('data-name').toLowerCase();

            const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(eventType);
            const locationMatch = !selectedLocation || selectedLocation === eventLocation;
            const searchMatch = eventName.includes(searchText);

            if (typeMatch && locationMatch && searchMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    typeFilters.forEach(checkbox => {
        checkbox.addEventListener('change', updateEventDisplay);
    });

    locationFilter.addEventListener('change', updateEventDisplay);
    searchInput.addEventListener('input', updateEventDisplay);
    updateEventDisplay();
});
