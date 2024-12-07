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

document.getElementById('formularioEvento').addEventListener('submit', function (e) {
    e.preventDefault();

    const endereco = {
        id: eventoAtual ? eventoAtual.endereco_id : String(proximoId),
        local: document.getElementById('nomeLocal').value,
        rua: document.getElementById('rua').value,
        numero: document.getElementById('numero').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        cep: document.getElementById('cep').value
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

function salvarDados(endereco, evento) {
    let enderecos = JSON.parse(localStorage.getItem('enderecos')) || [];
    let eventos = JSON.parse(localStorage.getItem('eventos')) || [];

    enderecos.push(endereco);
    eventos.push(evento);

    localStorage.setItem('enderecos', JSON.stringify(enderecos));
    localStorage.setItem('eventos', JSON.stringify(eventos));

    Promise.all([
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
    ])
    .then(responses => {
        if (!responses.every(r => r.ok)) {
            throw new Error('Falha ao salvar dados no servidor');
        }
        return Promise.all(responses.map(r => r.json()));
    })
    .then(() => {
        console.log("Dados salvos com sucesso!");
        carregarEventos();
        resetarFormulario();
    })
    .catch(error => console.error("Erro ao salvar dados:", error));
}

function atualizarDados(endereco, evento) {
    Promise.all([
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
    ])
    .then(responses => {
        if (!responses.every(r => r.ok)) {
            throw new Error('Falha ao atualizar dados no servidor');
        }
        return Promise.all(responses.map(r => r.json()));
    })
    .then(() => {
        console.log("Dados atualizados com sucesso!");
        carregarEventos();
        resetarFormulario();
    })
    .catch(error => console.error("Erro ao atualizar dados:", error));
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
                <a href="#" onclick="verPaginaEvento('${evento.id}')">Ver página do evento</a>
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
    const elementos = {
        nome: document.getElementById('nome'),
        data: document.getElementById('data'),
        descricao: document.getElementById('descricao'),
        categoria: document.getElementById('categoria'),
        nomeLocal: document.getElementById('nomeLocal'),
        rua: document.getElementById('rua'),
        numero: document.getElementById('numero'),
        cidade: document.getElementById('cidade'),
        estado: document.getElementById('estado'),
        cep: document.getElementById('cep')
    };

    for (const [key, element] of Object.entries(elementos)) {
        if (!element) {
            throw new Error(`Elemento ${key} não encontrado`);
        }
    }

    elementos.nome.value = evento.nome;
    elementos.data.value = evento.data;
    elementos.descricao.value = evento.descricao;
    elementos.categoria.value = evento.id_categoria;
    elementos.nomeLocal.value = endereco.local || '';
    elementos.rua.value = endereco.rua;
    elementos.numero.value = endereco.numero;
    elementos.cidade.value = endereco.cidade;
    elementos.estado.value = endereco.estado;
    elementos.cep.value = endereco.cep;

    const containerImagem = document.getElementById('containerImagem');
    if (containerImagem && evento.imagem) {
        containerImagem.innerHTML = `<img src="${evento.imagem}" alt="Imagem do Evento" class="imagem-evento">`;
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