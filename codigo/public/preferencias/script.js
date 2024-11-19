let selectedPreferences = [];

function resetPreferencesForNewUser() {
    localStorage.clear();
    selectedPreferences = [];
    renderCards();
    console.log('Preferências redefinidas para um novo usuário.');
}

document.addEventListener('DOMContentLoaded', () => {
    resetPreferencesForNewUser();
});

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

function renderCards() {
    const container = document.querySelector('.categories');
    const cards = Array.from(container.children);

    const selectedCards = cards.filter(card => selectedPreferences.includes(card.getAttribute('data-category')));
    const unselectedCards = cards.filter(card => !selectedPreferences.includes(card.getAttribute('data-category')));

    selectedCards.forEach(card => card.classList.add('active'));
    unselectedCards.forEach(card => card.classList.remove('active'));
    container.innerHTML = '';
    selectedCards.concat(unselectedCards).forEach(card => container.appendChild(card));
}

function savePreferences() {
    localStorage.setItem('preferences', JSON.stringify(selectedPreferences));
    renderCards();
    alert('Preferências salvas e ordenadas com sucesso!');
}
