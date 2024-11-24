function mostrarTela(telaId) {
    const containers = document.querySelectorAll('.container');
    containers.forEach(container => container.classList.remove('active'));

    const telaSelecionada = document.getElementById(telaId);
    if (telaSelecionada) {
        telaSelecionada.classList.add('active');

        if (telaId === 'maisFavoritados') createFavoritedEventsChart('graficoFavoritos');
        if (telaId === 'maisConfirmados') createConfirmedEventsChart('graficoConfirmacoes');
    } else {
        console.error(`Tela com ID "${telaId}" não encontrada.`);
    }
}

let favoritosChart = null;
let confirmacoesChart = null;

async function fetchData(endpoint) {
    try {
        const response = await fetch(`http://localhost:3000/${endpoint}`);
        if (!response.ok) throw new Error(`Erro ao buscar ${endpoint}: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Função que cria o gráfico de eventos mais favoritados
async function createFavoritedEventsChart(idContainer) {
    try {
        const eventos = await fetchData('eventos');
        const favoritos = await fetchData('favoritos');

        const favoritosPorEvento = favoritos.reduce((acc, favorito) => {
            acc[favorito.id_evento] = (acc[favorito.id_evento] || 0) + 1;
            return acc;
        }, {});

        const labels = eventos.map(evento => evento.nome);
        const dataValues = eventos.map(evento => favoritosPorEvento[evento.id] || 0);

        if (favoritosChart) {
            favoritosChart.destroy();
        }

        const ctx = document.getElementById(idContainer).getContext('2d');
        favoritosChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Quantidade de Favoritos',
                    data: dataValues,
                    backgroundColor: 'rgba(255, 206, 86, 0.5)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    } catch (error) {
        console.error('Erro ao criar o gráfico de favoritos:', error);
    }
}

// Função que cria o gráfico de eventos mais confirmados
async function createConfirmedEventsChart(idContainer) {
    try {
        const eventos = await fetchData('eventos');
        const confirmacoes = await fetchData('confirmacao');

        // Filtra apenas confirmed: true
        const confirmacoesValidas = confirmacoes.filter(c => c.confirmed);

        const confirmacoesPorEvento = confirmacoesValidas.reduce((acc, confirmacao) => {
            acc[confirmacao.id_evento] = (acc[confirmacao.id_evento] || 0) + 1;
            return acc;
        }, {});

        const labels = eventos.map(evento => evento.nome);
        const dataValues = eventos.map(evento => confirmacoesPorEvento[evento.id] || 0);

        if (confirmacoesChart) {
            confirmacoesChart.destroy();
        }

        const ctx = document.getElementById(idContainer).getContext('2d');
        confirmacoesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Quantidade de Confirmações',
                    data: dataValues,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    } catch (error) {
        console.error('Erro ao criar o gráfico de confirmações:', error);
    }
}

document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', event => {
        const telaId = event.target.getAttribute('onclick').match(/'(.*?)'/)[1];
        mostrarTela(telaId);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    createFavoritedEventsChart('graficoFavoritos');
    createConfirmedEventsChart('graficoConfirmacoes');
});