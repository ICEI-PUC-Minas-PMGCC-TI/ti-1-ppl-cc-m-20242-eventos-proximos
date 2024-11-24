let selectedPreferences = [];

document.addEventListener('DOMContentLoaded', () => {
    loadPreferences();
});

async function loadPreferences() {
    try {
        const response = await fetch('http://localhost:3000/preferences/1');
        if (!response.ok) {
            throw new Error(`Erro ao carregar preferências: ${response.status}`);
        }
        const data = await response.json();
        selectedPreferences = data.categories || [];
        renderCards();
    } catch (error) {
        console.error('Erro ao carregar preferências:', error);
    }
}

function togglePreference(card) {
    const category = card.getAttribute('data-category');
    if (selectedPreferences.includes(category)) {
        selectedPreferences = selectedPreferences.filter(item => item !== category);
        card.classList.remove('active');
    } else {
        selectedPreferences.push(category);
        card.classList.add('active');
    }
}

async function savePreferences() {
    try {
        const response = await fetch('http://localhost:3000/preferences/1', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: "Fulano",
                categories: selectedPreferences
            })
        });

        if (!response.ok) {
            throw new Error(`Erro ao salvar preferências: ${response.status}`);
        }

        alert('Preferências salvas com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar preferências:', error);
    }
}

function resetPreferences() {
    selectedPreferences = [];
    renderCards();
    alert('Todas as preferências foram desmarcadas!');
}

function renderCards() {
    const container = document.querySelector('.categories');
    if (!container) {
        console.error('Elemento ".categories" não encontrado no DOM.');
        return;
    }

    const cards = Array.from(container.children);

    const selectedCards = cards.filter(card =>
        selectedPreferences.includes(card.getAttribute('data-category'))
    );
    const unselectedCards = cards.filter(card =>
        !selectedPreferences.includes(card.getAttribute('data-category'))
    );

    selectedCards.forEach(card => card.classList.add('active'));
    unselectedCards.forEach(card => card.classList.remove('active'));
    container.innerHTML = '';
    selectedCards.concat(unselectedCards).forEach(card => container.appendChild(card));
}
async function resetPreferences() {
    try {
        const response = await fetch('http://localhost:3000/defaultPreferences');
        const defaultData = await response.json();

        const restoreResponse = await fetch('http://localhost:3000/preferences/1', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: "Fulano",
                categories: defaultData.categories
            })
        });

        if (!restoreResponse.ok) {
            throw new Error(`Erro ao restaurar preferências: ${restoreResponse.status}`);
        }

        selectedPreferences = defaultData.categories;
        renderCards();
        alert('Preferências restauradas com sucesso!');
    } catch (error) {
        console.error('Erro ao restaurar preferências:', error);
    }
}
