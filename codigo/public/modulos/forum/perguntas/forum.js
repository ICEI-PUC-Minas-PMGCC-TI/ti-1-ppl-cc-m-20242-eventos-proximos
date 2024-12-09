let maxId = 0;

function carregarPerguntas() {
  const perguntasHolder = document.getElementById('perguntas');
  perguntasHolder.innerHTML = '';

  fetch('http://localhost:3000/perguntas')
    .then((response) => response.json())
    .then((data) => {
      maxId = 0;
      data.forEach((pergunta) => {
        criarPerguntaElement(pergunta, perguntasHolder);
        if (pergunta.id > maxId) {
          maxId = pergunta.id;
        }
      });
    })
    .catch((error) => {
      console.error('Erro ao carregar perguntas:', error);
    });
}

function criarPerguntaElement(pergunta, container) {
  const perguntaDiv = document.createElement('div');
  perguntaDiv.classList.add('pergunta_holder');

  perguntaDiv.innerHTML = `
    <h3>${pergunta.pergunta}</h3>
    <p>${pergunta.resumo}</p>
    <button class="btn_respostas" onclick="mostrarResposta(${pergunta.id})">Ver Resposta</button>
  `;

  container.appendChild(perguntaDiv);
}

function mostrarResposta(id) {
  window.location.href = `detalhes.html?id=${id}`;
}

document.addEventListener('DOMContentLoaded', function () {
  const popup = document.getElementById('popup');
  const novaPerguntaBtn = document.getElementById('novaPerguntaBtn');
  const closeBtn = document.querySelector('.close');
  const adicionarPerguntaBtn = document.getElementById('adicionarPergunta');

  novaPerguntaBtn.onclick = function () {
    popup.style.display = 'block';
  };

  closeBtn.onclick = function () {
    popup.style.display = 'none';
  };

  window.onclick = function (event) {
    if (event.target === popup) {
      popup.style.display = 'none';
    }
  };

  adicionarPerguntaBtn.onclick = function () {
    const pergunta = document.getElementById('pergunta').value;
    const resumo = document.getElementById('resumo').value;
    const respostaCompleta = document.getElementById('respostaCompleta').value;

    if (pergunta && resumo && respostaCompleta) {
      const novaPergunta = {
        id: maxId + 1, // Calcula um novo ID baseado no maior ID atual
        id_usuario: 1, // Define o id_usuario como 1
        pergunta: pergunta,
        resumo: resumo,
        respostaCompleta: respostaCompleta,
      };

      adicionarPerguntaAoServidor(novaPergunta);
      popup.style.display = 'none';
      document.getElementById('pergunta').value = '';
      document.getElementById('resumo').value = '';
      document.getElementById('respostaCompleta').value = '';
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  };

  // Adicionando o evento de pesquisa
  const searchInput = document.getElementById('search-id-input');
  searchInput.addEventListener('input', function () {
    const searchValue = this.value.trim();
    if (searchValue === '') {
      carregarPerguntas(); // Se o campo de pesquisa estiver vazio, recarrega todas as perguntas
    } else {
      filtrarPerguntasPorId(searchValue);
    }
  });
});

window.onload = carregarPerguntas;

function adicionarPerguntaAoServidor(novaPergunta) {
  fetch('http://localhost:3000/perguntas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(novaPergunta),
  })
    .then((response) => {
      if (response.ok) {
        carregarPerguntas(); // Recarrega as perguntas após adicionar
      } else {
        console.error('Erro ao adicionar pergunta:', response.statusText);
      }
    })
    .catch((error) => {
      console.error('Erro na requisição:', error);
    });
}

function filtrarPerguntasPorId(id) {
  const perguntasHolder = document.getElementById('perguntas');
  perguntasHolder.innerHTML = ''; // Limpa as perguntas atuais

  fetch(`http://localhost:3000/perguntas?id=${id}`)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((pergunta) =>
        criarPerguntaElement(pergunta, perguntasHolder),
      );
    })
    .catch((error) => {
      console.error('Erro ao filtrar perguntas:', error);
    });
}
