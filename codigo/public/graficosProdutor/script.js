// Adicione esta função para carregar o conteúdo inicial
function carregarConteudoInicial() {
    mostrarTela('meusEventos');
    carregarCategorias();
}

// Adicione um event listener para quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', carregarConteudoInicial);

function carregarCategorias() {
    fetch("http://localhost:3000/categorias")
        .then(response => response.json())
        .then(categorias => {
            const selectCategoria = document.getElementById('categoria');
            if (!selectCategoria) return;
            
            selectCategoria.innerHTML = '<option value="">Selecione uma categoria</option>';
            
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.id;
                option.textContent = categoria.tipo;
                selectCategoria.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar categorias:', error));
}

function carregarMeusEventos() {
    Promise.all([
        fetch("http://localhost:3000/eventos").then(r => r.json()),
        fetch("http://localhost:3000/categorias").then(r => r.json())
    ])
    .then(([eventos, categorias]) => {
        if (Array.isArray(eventos)) {
            exibirMeusEventos(eventos, categorias);
        }
    })
    .catch(error => console.error('Erro ao carregar eventos:', error));
}

function exibirMeusEventos(eventos, categorias) {
    const meusEventos = document.getElementById('meusEventos');
    if (!meusEventos) return;
    
    meusEventos.innerHTML = `
        <h3>Meus Eventos</h3>
        <p>Lista de eventos criados por você!</p>
        <button onclick="window.location.href='../cadastroEventos/cadastroEventos.html'" class="btn-neutral">
            Cadastrar Evento
        </button>
        <div class="eventos-lista">
    `;
    
    eventos.forEach(evento => {
        const categoria = categorias.find(c => c.id === evento.id_categoria);
        const itemEvento = document.createElement('div');
        itemEvento.classList.add('item-evento');
        
        const imagemHtml = evento.imagem && !evento.imagem.startsWith('blob:')
            ? `<div class="evento-imagem">
                 <img src="${evento.imagem}" 
                      alt="Imagem do Evento" 
                      class="imagem-evento"
                      onerror="this.style.display='none'">
               </div>`
            : '';
        
        itemEvento.innerHTML = `
            <div class="detalhes-evento">
                ${imagemHtml}
                <div class="info-evento">
                    <strong>${evento.nome}</strong>
                    <br>
                    <em>Categoria: ${categoria ? categoria.tipo : 'N/A'}</em> | Data: ${evento.data}
                    <br>
                    <em>${evento.descricao}</em>
                </div>
            </div>
            <div class="acoes-evento">
                <a href="../descEventos/descEventos.html?id=${evento.id}">Ver página do evento</a>
            </div>
        `;
        
        meusEventos.querySelector('.eventos-lista').appendChild(itemEvento);
    });
}

function mostrarTela(telaId) {
    const containers = document.querySelectorAll('.container');
    containers.forEach(container => container.classList.remove('active'));

    const telaSelecionada = document.getElementById(telaId);
    if (telaSelecionada) {
        telaSelecionada.classList.add('active');

        if (telaId === 'maisFavoritados') createFavoritedEventsChart('graficoFavoritos');
        if (telaId === 'maisConfirmados') createConfirmedEventsChart('graficoConfirmacoes');
        if (telaId === 'meusEventos') carregarMeusEventos();
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