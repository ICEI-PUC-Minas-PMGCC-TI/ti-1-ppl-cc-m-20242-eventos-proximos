document.addEventListener('DOMContentLoaded', carregarEventos);

document.getElementById('formularioEvento').addEventListener('submit', function (e) {
    e.preventDefault();

    const evento = {
        id: parseInt(document.getElementById('id').value),
        nome: document.getElementById('nome').value,
        data: document.getElementById('data').value,
        descricao: document.getElementById('descricao').value,
        categoria: document.getElementById('categoria').value,
        endereco: {
            rua: document.getElementById('rua').value,
            numero: document.getElementById('numero').value,
            cidade: document.getElementById('cidade').value,
            estado: document.getElementById('estado').value,
            cep: document.getElementById('cep').value
        },
        status: "ativo",
        id_usuario: 1,
        imagem: document.getElementById('imagem').files[0] ? URL.createObjectURL(document.getElementById('imagem').files[0]) : null
    };

    // Salva o evento no servidor e no localStorage
    salvarEvento(evento);
});

function carregarEventos() {
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    exibirEventos(eventos);
}

async function salvarEvento(evento) {
    // Primeiro, salva o evento no localStorage
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    
    const indiceExistente = eventos.findIndex(e => e.id === evento.id);
    if (indiceExistente !== -1) {
        const novaImagem = document.getElementById('imagem').files[0];
        evento.imagem = novaImagem ? URL.createObjectURL(novaImagem) : eventos[indiceExistente].imagem;
        eventos[indiceExistente] = evento;
    } else {
        if (document.getElementById('imagem').files[0]) {
            evento.imagem = URL.createObjectURL(document.getElementById('imagem').files[0]);
        }
        eventos.push(evento);
    }

    // Atualiza o localStorage com a lista de eventos
    localStorage.setItem('eventos', JSON.stringify(eventos));

    // Agora, envia o evento para o servidor
    const resposta = await fetch("http://localhost:3000/eventos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(evento),
    });

    if (resposta.ok) {
        console.log("Evento salvo no servidor com sucesso!");
        carregarEventos(); // Atualiza a lista com o novo evento
    } else {
        console.error("Erro ao salvar o evento no servidor:", resposta.statusText);
    }

    // Exibe os eventos atualizados
    exibirEventos(eventos);
    resetarFormulario();
}

function exibirEventos(eventos) {
    const listaEventos = document.getElementById('listaEventos');
    listaEventos.innerHTML = '';

    eventos.forEach(evento => {
        const itemEvento = document.createElement('div');
        itemEvento.classList.add('item-evento');
        itemEvento.innerHTML = `
            <div class="detalhes-evento">
                <img src="${evento.imagem}" alt="Imagem do Evento" class="imagem-evento">
                <div class="info-evento">
                    <strong>ID: ${evento.id}</strong> - <strong>${evento.nome}</strong> <br>
                    <em>${evento.categoria}</em> | Data: ${evento.data} <br>
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

function rolarParaTopo() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

async function editarEvento(id) {
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const evento = eventos.find(e => e.id === id);
    
    if (evento) {
        // Preenche o formulário com os dados do evento
        document.getElementById('id').value = evento.id;
        document.getElementById('nome').value = evento.nome;
        document.getElementById('data').value = evento.data;
        document.getElementById('descricao').value = evento.descricao;
        document.getElementById('categoria').value = evento.categoria;
        document.getElementById('rua').value = evento.endereco.rua;
        document.getElementById('numero').value = evento.endereco.numero;
        document.getElementById('cidade').value = evento.endereco.cidade;
        document.getElementById('estado').value = evento.endereco.estado;
        document.getElementById('cep').value = evento.endereco.cep;

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

        // Envia os dados para atualizar o evento no servidor
        const resposta = await fetch(`http://localhost:3000/eventos/${evento.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(evento),
        });

        if (resposta.ok) {
            console.log("Evento atualizado no servidor com sucesso!");
            carregarEventos(); // Atualiza a lista de eventos
        } else {
            console.error("Erro ao atualizar o evento no servidor:", resposta.statusText);
        }

        rolarParaTopo();
    } else {
        console.error("Evento não encontrado para edição.");
    }
}

async function excluirEvento(id) {
    let eventos = JSON.parse(localStorage.getItem('eventos')) || [];

    // Exclui o evento do localStorage
    eventos = eventos.filter(e => e.id !== id);
    localStorage.setItem('eventos', JSON.stringify(eventos));
    exibirEventos(eventos); // Atualiza a exibição dos eventos

    // Exclui o evento do servidor
    const resposta = await fetch(`http://localhost:3000/eventos/${id}`, {
        method: 'DELETE',
    });

    if (resposta.ok) {
        console.log("Evento excluído do servidor com sucesso!");
    } else {
        console.error("Erro ao excluir o evento do servidor:", resposta.statusText);
    }
}

function verPaginaEvento(id) {
    alert(`Exibindo a página do evento com ID: ${id}`);
}

function resetarFormulario() {
    document.getElementById('formularioEvento').reset();
}
