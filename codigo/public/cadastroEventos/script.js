let eventoAtual = null;

document.addEventListener('DOMContentLoaded', carregarEventos);

document.getElementById('formularioEvento').addEventListener('submit', function (e) {
    e.preventDefault();

    const timestamp = Date.now();

    const endereco = {
        id: eventoAtual ? eventoAtual.endereco_id : timestamp,
        local: document.getElementById('nomeLocal').value,
        rua: document.getElementById('rua').value,
        numero: document.getElementById('numero').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        cep: document.getElementById('cep').value
    }

    const evento = {
        id: eventoAtual ? eventoAtual.id : timestamp + 1,
        id_usuario: 1,
        nome: document.getElementById('nome').value,
        data: document.getElementById('data').value,
        id_endereco: endereco.id,
        descricao: document.getElementById('descricao').value,
        categoria: document.getElementById('categoria').value,
        status: "ativo",
        imagem: document.getElementById('imagem').files[0] ? URL.createObjectURL(document.getElementById('imagem').files[0]) : null
    };

    if (eventoAtual) {
        atualizarDados(endereco, evento);
    } else {
        salvarDados(endereco, evento);
    }
    
    eventoAtual = null;
});

function carregarEventos() {
    fetch("http://localhost:3000/eventos")
        .then(response => response.json())
        .then(data => exibirEventos(data))
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
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(() => {
        console.log("Dados salvos no servidor com sucesso!");
        carregarEventos();
    })
    .catch(error => console.error("Erro ao salvar dados no servidor:", error));

    resetarFormulario();
}

function atualizarDados(endereco, evento) {
    let enderecos = JSON.parse(localStorage.getItem('enderecos')) || [];
    let eventos = JSON.parse(localStorage.getItem('eventos')) || [];

    enderecos = enderecos.map(e => e.id === endereco.id ? endereco : e);
    eventos = eventos.map(e => e.id === evento.id ? evento : e);

    localStorage.setItem('enderecos', JSON.stringify(enderecos));
    localStorage.setItem('eventos', JSON.stringify(eventos));

    Promise.all([
        fetch('http://localhost:3000/enderecos/${endereco.id}', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(endereco)
        }),
        fetch('http://localhost:3000/eventos/${evento.id}', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(evento)
        })
    ])
    .then(() => {
        console.log("Dados atualizados com sucesso!");
        carregarEventos();
        resetarFormulario();
    })
    .catch(error => console.error("Erro ao atualizar os dados:", error));
}

function exibirEventos(eventos) {
    const listaEventos = document.getElementById('listaEventos');
    listaEventos.innerHTML = '';
    
    eventos.forEach(evento => {
        const itemEvento = document.createElement('div');
        itemEvento.classList.add('item-evento');
        
        const imagemHtml = evento.imagem 
            ? `<img src="${evento.imagem}" alt="Imagem do Evento" class="imagem-evento">`
            : '';
        
        itemEvento.innerHTML = `
            <div class="detalhes-evento">
                ${imagemHtml}
                <div class="info-evento">
                    <strong>${evento.nome}</strong>
                    <br>
                    <em>${evento.categoria}</em> | Data: ${evento.data}
                    <br>
                    <em>${evento.descricao}</em>
                </div>
            </div>
            <div class="acoes-evento">
                <button class="editar-btn" onclick="editarEvento(${evento.id})">Editar</button>
                <button class="excluir-btn" onclick="excluirEvento(${evento.id})">Excluir</button>
                <a href="#" onclick="verPaginaEvento(${evento.id})">Ver página do evento</a>
            </div>
        `;
        
        listaEventos.appendChild(itemEvento);
    });
}

async function editarEvento(id) {
    rolarParaTopo();
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const enderecos = JSON.parse(localStorage.getItem('enderecos')) || [];
    const evento = eventos.find(e => e.id === id);

    if (evento) {
        const endereco = enderecos.find(e => e.id === evento.id_endereco);

        eventoAtual = {
            id: evento.id,
            id_endereco: evento.id_endereco
        };

        document.getElementById('nome').value = evento.nome;
        document.getElementById('data').value = evento.data;
        document.getElementById('descricao').value = evento.descricao;
        document.getElementById('categoria').value = evento.id_categoria;
        document.getElementById('nomeLocal').value = endereco?.local || '';

        if (endereco) {
            document.getElementById('rua').value = endereco.rua;
            document.getElementById('numero').value = endereco.numero;
            document.getElementById('cidade').value = endereco.cidade;
            document.getElementById('estado').value = endereco.estado;
            document.getElementById('cep').value = endereco.cep;
            document.getElementById('bairro').value = endereco.bairro;
        }

        const containerImagem = document.getElementById('containerImagem');
        containerImagem.innerHTML = '';

        if (evento.imagem) {
            const imagemPreview = document.createElement('img');
            imagemPreview.src = evento.imagem;
            imagemPreview.alt = "Imagem do Evento";
            imagemPreview.classList.add('imagem-evento');
            imagemPreview.style.width = '100px';
            imagemPreview.style.height = 'auto';
            containerImagem.appendChild(imagemPreview);
        }
    } else {
        console.error("Evento não encontrado para edição.");
    }
}

async function excluirEvento(id) {
    try {
        let eventos = JSON.parse(localStorage.getItem('eventos')) || [];
        let enderecos = JSON.parse(localStorage.getItem('enderecos')) || [];

        const evento = eventos.find(e => e.id === id);
        if (!evento) return;

        const endereco = enderecos.find(e => e.id === local.endereco_id);
        if (!endereco) return;

        eventos = eventos.filter(e => e.id !== id);
        enderecos = enderecos.filter(e => e.id !== endereco.id);

        localStorage.setItem('eventos', JSON.stringify(eventos));
        localStorage.setItem('enderecos', JSON.stringify(enderecos));

        await Promise.all([
            fetch('http://localhost:3000/eventos/${id}', { method: 'DELETE' }),
            fetch('http://localhost:3000/enderecos/${endereco.id}', { method: 'DELETE' })
        ]);

        carregarEventos();
    } catch (error) {
        console.error("Erro na comunicação com o servidor:", error);
    }
}

function verPaginaEvento(id) {
    alert('Exibindo a página do evento com ID: ${id}');
}

function resetarFormulario() {
    document.getElementById('formularioEvento').reset();
    const containerImagem = document.getElementById('containerImagem');
    if (containerImagem) {
        containerImagem.innerHTML = '';
    }
}

function rolarParaTopo() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}