let eventoAtual = null;
let proximoId = 6;

document.addEventListener('DOMContentLoaded', () => {
    carregarEventos();
    carregarCategorias();
    fetch("http://localhost:3000/eventos")
        .then(response => response.json())
        .then(eventos => {
            if (eventos.length > 0) {
                const maiorId = Math.max(...eventos.map(e => parseInt(e.id)));
                proximoId = maiorId + 1;
            }
        })
        .catch(error => console.error('Erro ao carregar IDs:', error));
});

function carregarCategorias() {
    fetch("http://localhost:3000/categorias")
        .then(response => response.json())
        .then(categorias => {
            const selectCategoria = document.getElementById('categoria');
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

async function buscarCoordenadas(endereco) {
    const params = new URLSearchParams({
        street: `${endereco.rua}`,
        number: endereco.numero,
        neighborhood: endereco.bairro,
        place: endereco.cidade,
        region: endereco.estado,
        postcode: endereco.cep,
        country: 'Brasil'
    });

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${params.toString()}.json?access_token=${mapboxgl.accessToken}&limit=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
            endereco.coordinates = data.features[0].geometry.coordinates;
            return endereco.coordinates;
        }
        console.log('Nenhuma coordenada encontrada para o endereço');
        return null;
    } catch (error) {
        console.error('Erro ao buscar coordenadas:', error);
        return null;
    }
}

document.getElementById('formularioEvento').addEventListener('submit', async function (e) {
    e.preventDefault();

    const endereco = {
        id: eventoAtual ? eventoAtual.endereco_id : String(proximoId),
        local: document.getElementById('nomeLocal').value,
        rua: document.getElementById('rua').value,
        numero: document.getElementById('numero').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        cep: document.getElementById('cep').value,
        coordinates: []
    };

    const coordinates = await buscarCoordenadas(endereco);
    if (coordinates) {
        endereco.coordinates = coordinates;
    }

    const evento = {
        id: eventoAtual ? eventoAtual.id : String(proximoId + 1),
        id_usuario: 1,
        nome: document.getElementById('nome').value,
        data: document.getElementById('data').value,
        id_endereco: endereco.id,
        descricao: document.getElementById('descricao').value,
        id_categoria: document.getElementById('categoria').value,
        status: "ativo",
        imagem: document.getElementById('imagem').files[0] ? URL.createObjectURL(document.getElementById('imagem').files[0]) : null
    };

    if (eventoAtual) {
        atualizarDados(endereco, evento);
    } else {
        salvarDados(endereco, evento);
        proximoId += 2;
    }
    
    eventoAtual = null;
});

function carregarEventos() {
    fetch("http://localhost:3000/eventos")
        .then(response => response.json())
        .then(eventos => {
            if (Array.isArray(eventos)) {
                fetch("http://localhost:3000/categorias")
                    .then(response => response.json())
                    .then(categorias => {
                        exibirEventos(eventos, categorias);
                    });
            }
        })
        .catch(error => console.error('Erro ao carregar eventos:', error));
}

async function salvarDados(endereco, evento) {
    try {
        const coordinates = await buscarCoordenadas(endereco);
        if (coordinates) {
            endereco.coordinates = coordinates;
        }

        let enderecos = JSON.parse(localStorage.getItem('enderecos')) || [];
        let eventos = JSON.parse(localStorage.getItem('eventos')) || [];
        
        enderecos.push(endereco);
        eventos.push(evento);
        
        localStorage.setItem('enderecos', JSON.stringify(enderecos));
        localStorage.setItem('eventos', JSON.stringify(eventos));

        await Promise.all([
            fetch("http://localhost:3000/enderecos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(endereco)
            }),
            fetch("http://localhost:3000/eventos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(evento)
            })
        ]);

        console.log("Dados salvos com sucesso!");
        carregarEventos();
        resetarFormulario();
    } catch (error) {
        console.error("Erro ao salvar dados:", error);
    }
}

async function atualizarDados(endereco, evento) {
    try {
        const coordinates = await buscarCoordenadas(endereco);
        if (coordinates) {
            endereco.coordinates = coordinates;
        }

        const responses = await Promise.all([
            fetch(`http://localhost:3000/enderecos/${endereco.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(endereco)
            }),
            fetch(`http://localhost:3000/eventos/${evento.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(evento)
            })
        ]);

        if (!responses.every(r => r.ok)) {
            throw new Error('Falha ao atualizar dados no servidor');
        }

        console.log("Dados atualizados com sucesso!");
        carregarEventos();
        resetarFormulario();
    } catch (error) {
        console.error("Erro ao atualizar dados:", error);
    }
}

function exibirEventos(eventos, categorias) {
    const listaEventos = document.getElementById('listaEventos');
    if (!listaEventos) return;
    
    listaEventos.innerHTML = '';
    
    eventos.forEach(evento => {
        const categoria = categorias.find(c => c.id === evento.id_categoria);
        const itemEvento = document.createElement('div');
        itemEvento.classList.add('item-evento');

        const imagemHtml = evento.imagem 
            ? `<div class="evento-imagem">
                 <img src="${evento.imagem}" 
                      alt="Imagem do Evento" 
                      class="imagem-evento"
                      onerror="this.src='caminho/para/imagem/padrao.jpg'">
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
                <button class="editar-btn" onclick="editarEvento('${evento.id}')">Editar</button>
                <button class="excluir-btn" onclick="excluirEvento('${evento.id}')">Excluir</button>
                <a href="../descEventos/descEventos.html?id=${evento.id}">Ver página do evento</a>
            </div>
        `;
        
        listaEventos.appendChild(itemEvento);
    });
}

async function editarEvento(id) {
    try {
        const [eventoResponse, enderecoResponse] = await Promise.all([
            fetch(`http://localhost:3000/eventos/${id}`),
            fetch(`http://localhost:3000/enderecos`)
        ]);

        if (!eventoResponse.ok || !enderecoResponse.ok) {
            const errorData = {
                message: "Falha ao carregar dados",
                code: eventoResponse.status || enderecoResponse.status
            };
            throw new Error(`${errorData.message} (Código: ${errorData.code})`);
        }

        const evento = await eventoResponse.json();
        const enderecos = await enderecoResponse.json();
        const endereco = enderecos.find(e => e.id === evento.id_endereco);

        if (!evento || !endereco) {
            throw new Error('Dados não encontrados');
        }

        eventoAtual = {
            id: evento.id,
            endereco_id: evento.id_endereco
        };

        preencherFormulario(evento, endereco);
        rolarParaTopo();

    } catch (error) {
        console.error("Erro ao carregar dados para edição:", error);
        alert("Erro ao carregar dados. Por favor, tente novamente mais tarde.");
    }
}

function preencherFormulario(evento, endereco) {
    document.getElementById('nome').value = evento.nome;
    document.getElementById('data').value = evento.data;
    document.getElementById('descricao').value = evento.descricao;
    document.getElementById('categoria').value = evento.id_categoria;
    document.getElementById('nomeLocal').value = endereco.local || '';
    document.getElementById('rua').value = endereco.rua;
    document.getElementById('numero').value = endereco.numero;
    document.getElementById('bairro').value = endereco.bairro;
    document.getElementById('cidade').value = endereco.cidade;
    document.getElementById('estado').value = endereco.estado;
    document.getElementById('cep').value = endereco.cep;

    const containerImagem = document.getElementById('containerImagem');
    if (containerImagem) {
        containerImagem.innerHTML = evento.imagem 
            ? `<img src="${evento.imagem}" alt="Imagem do Evento" class="imagem-evento">` 
            : '';
    }
}

async function excluirEvento(id) {
    try {
        const eventoResponse = await fetch(`http://localhost:3000/eventos/${id}`);
        
        if (eventoResponse.status === 404) {
            throw new Error('Evento não encontrado');
        }
        
        if (!eventoResponse.ok) {
            throw new Error('Erro ao buscar evento');
        }

        const evento = await eventoResponse.json();

        const enderecoResponse = await fetch(`http://localhost:3000/enderecos/${evento.id_endereco}`);
        
        if (enderecoResponse.status === 404) {
            throw new Error('Endereço não encontrado');
        }
        
        if (!enderecoResponse.ok) {
            throw new Error('Erro ao buscar endereço');
        }

        const deleteEventoResponse = await fetch(`http://localhost:3000/eventos/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        const deleteEnderecoResponse = await fetch(`http://localhost:3000/enderecos/${evento.id_endereco}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!deleteEventoResponse.ok || !deleteEnderecoResponse.ok) {
            throw new Error('Erro ao excluir dados');
        }

        console.log("Evento excluído com sucesso!");
        carregarEventos();
        
    } catch (error) {
        console.error("Erro:", error.message);
        
        if (error.message.includes('não encontrado')) {
            alert(error.message);
        } else {
            alert('Erro ao excluir evento. Tente novamente.');
        }
    }
}

function verPaginaEvento(id) {
    alert(`Exibindo a página do evento com ID: ${id}`);
}

function resetarFormulario() {
    const form = document.getElementById('formularioEvento');
    if (form) form.reset();
    
    const containerImagem = document.getElementById('containerImagem');
    if (containerImagem) containerImagem.innerHTML = '';
    
    eventoAtual = null;
}

function rolarParaTopo() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

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