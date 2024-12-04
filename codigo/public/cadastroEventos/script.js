document.addEventListener('DOMContentLoaded', carregarEventos);

document.getElementById('formularioEvento').addEventListener('submit', function (e) {
    e.preventDefault();

    const endereco = {
        id: Date.now(),
        rua: document.getElementById('rua').value,
        numero: document.getElementById('numero').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        cep: document.getElementById('cep').value
    }

    const local = {
        id: Date.now(),
        nome: document.getElementById('nome').value,
        endereco_id: endereco.id
    }

    const evento = {
        id_usuario: 1,
        id: Date.now(),
        nome: document.getElementById('nome').value,
        data: document.getElementById('data').value,
        id_local: local.id,
        descricao: document.getElementById('descricao').value,
        categoria: document.getElementById('categoria').value,
        status: "ativo",
        imagem: document.getElementById('imagem').files[0] ? URL.createObjectURL(document.getElementById('imagem').files[0]) : null
    };

    salvarDados(endereco, local, evento);
});

function carregarEventos() {
    fetch("http://localhost:3000/eventos")
        .then(response => response.json())
        .then(data => exibirEventos(data))
        .catch(error => console.error('Erro ao carregar eventos:', error));
}

function salvarDados(endereco, local, evento) {
    let enderecos = JSON.parse(localStorage.getItem('enderecos')) || [];
    enderecos.push(endereco);
    localStorage.setItem('enderecos', JSON.stringify(enderecos));

    let locais = JSON.parse(localStorage.getItem('locais')) || [];
    locais.push(local);
    localStorage.setItem('locais', JSON.stringify(locais));

    let eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    eventos.push(evento);
    localStorage.setItem('eventos', JSON.stringify(eventos));

    Promise.all([
        fetch("http://localhost:3000/enderecos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(endereco)
        }),
        fetch("http://localhost:3000/locais", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(local)
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
    rolarParaTopo();
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const evento = eventos.find(e => e.id === id);

    if (evento) {
        document.getElementById('nome').value = evento.nome;
        document.getElementById('data').value = evento.data;
        document.getElementById('descricao').value = evento.descricao;
        document.getElementById('categoria').value = evento.categoria;

        const locais = JSON.parse(localStorage.getItem('locais')) || [];
        const local = locais.find(l => l.id === evento.id_local);

        if (local) {
            document.getElementById('nomeLocal').value = local.nome;

            const enderecos = JSON.parse(localStorage.getItem('enderecos')) || [];
            const endereco = enderecos.find(e => e.id === local.endereco_id);

            if (endereco) {
                document.getElementById('rua').value = endereco.rua;
                document.getElementById('numero').value = endereco.numero;
                document.getElementById('cidade').value = endereco.cidade;
                document.getElementById('estado').value = endereco.estado;
                document.getElementById('cep').value = endereco.cep;
            }
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

        document.getElementById('formularioEvento').onsubmit = async function (e) {
            e.preventDefault();

            endereco.rua = document.getElementById('rua').value;
            endereco.numero = document.getElementById('numero').value;
            endereco.cidade = document.getElementById('cidade').value;
            endereco.estado = document.getElementById('estado').value;
            endereco.cep = document.getElementById('cep').value;

            local.nome = document.getElementById('nomeLocal').value;

            evento.nome = document.getElementById('nome').value;
            evento.data = document.getElementById('data').value;
            evento.descricao = document.getElementById('descricao').value;
            evento.categoria = document.getElementById('categoria').value;

            const novaImagemArquivo = document.getElementById('imagem').files[0];
            if (novaImagemArquivo) {
                evento.imagem = URL.createObjectURL(novaImagemArquivo);
            }

            localStorage.setItem('enderecos', JSON.stringify(enderecos));
            localStorage.setItem('locais', JSON.stringify(locais));
            localStorage.setItem('eventos', JSON.stringify(eventos));

            try {
                await Promise.all([
                    fetch(`http://localhost:3000/enderecos/${endereco.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(endereco)
                    }),
                    fetch(`http://localhost:3000/locais/${local.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(local)
                    }),
                    fetch(`http://localhost:3000/eventos/${evento.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(evento)
                    })
                ]);

                console.log("Dados atualizados no servidor com sucesso!");
                carregarEventos();
                resetarFormulario();
                
                this.onsubmit = null;

            } catch (error) {
                console.error("Erro ao atualizar os dados no servidor:", error);
            }
        };

    } else {
        console.error("Evento não encontrado para edição.");
    }
}

async function excluirEvento(id) {
    try {
        let eventos = JSON.parse(localStorage.getItem('eventos')) || [];
        let locais = JSON.parse(localStorage.getItem('locais')) || [];
        let enderecos = JSON.parse(localStorage.getItem('enderecos')) || [];

        const evento = eventos.find(e => e.id === id);
        if (!evento) {
            console.error("Evento não encontrado.");
            return;
        }

        const local = locais.find(l => l.id === evento.id_local);
        if (!local) {
            console.error("Local associado ao evento não encontrado.");
            return;
        }

        const endereco = enderecos.find(e => e.id === local.endereco_id);
        if (!endereco) {
            console.error("Endereço associado ao local não encontrado.");
            return;
        }

        eventos = eventos.filter(e => e.id !== id);
        locais = locais.filter(l => l.id !== local.id);
        enderecos = enderecos.filter(e => e.id !== endereco.id);

        localStorage.setItem('eventos', JSON.stringify(eventos));
        localStorage.setItem('locais', JSON.stringify(locais));
        localStorage.setItem('enderecos', JSON.stringify(enderecos));

        exibirEventos(eventos);

        const [respostaEvento, respostaLocal, respostaEndereco] = await Promise.all([
            fetch(`http://localhost:3000/eventos/${id}`, { method: 'DELETE' }),
            fetch(`http://localhost:3000/locais/${local.id}`, { method: 'DELETE' }),
            fetch(`http://localhost:3000/enderecos/${endereco.id}`, { method: 'DELETE' })
        ]);

        if (respostaEvento.ok && respostaLocal.ok && respostaEndereco.ok) {
            console.log("Evento, local e endereço excluídos do servidor com sucesso!");
        } else {
            console.error("Erro ao excluir os dados do servidor:", {
                evento: respostaEvento.statusText,
                local: respostaLocal.statusText,
                endereco: respostaEndereco.statusText
            });
        }
    } catch (error) {
        console.error("Erro na comunicação com o servidor:", error);
    }
}

function verPaginaEvento(id) {
    alert(`Exibindo a página do evento com ID: ${id}`);
}

function resetarFormulario() {
    document.getElementById('formularioEvento').reset();
}
