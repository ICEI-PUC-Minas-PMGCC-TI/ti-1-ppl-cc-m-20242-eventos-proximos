let maxId = 0;

function carregarPerguntas() {
  const perguntasJson = localStorage.getItem('perguntas');
  const perguntasHolder = document.getElementById('perguntas');
  perguntasHolder.innerHTML = '';
  maxId = 0;

  if (perguntasJson) {
    const data = JSON.parse(perguntasJson);

    data.perguntas.forEach((pergunta) => {
      criarPerguntaElement(pergunta, perguntasHolder);
      if (pergunta.id > maxId) {
        maxId = pergunta.id;
      }
    });
  } else {
    const initialData = {
      perguntas: [],
    };
    localStorage.setItem('perguntas', JSON.stringify(initialData));
  }
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
        id: maxId + 1,
        pergunta: pergunta,
        resumo: resumo,
        respostaCompleta: respostaCompleta,
      };

      adicionarPerguntaAoLocalStorage(novaPergunta);
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

function adicionarPerguntaAoLocalStorage(novaPergunta) {
  const perguntasJson = localStorage.getItem('perguntas');
  const perguntasData = JSON.parse(perguntasJson);

  perguntasData.perguntas.push(novaPergunta);
  localStorage.setItem('perguntas', JSON.stringify(perguntasData));
  carregarPerguntas();
}

function filtrarPerguntasPorId(id) {
  const perguntasHolder = document.getElementById('perguntas');
  perguntasHolder.innerHTML = ''; // Limpa as perguntas atuais

  const perguntasJson = localStorage.getItem('perguntas');
  if (perguntasJson) {
    const data = JSON.parse(perguntasJson);
    const filtradas = data.perguntas.filter(
      (pergunta) => pergunta.id.toString() === id,
    );

    filtradas.forEach((pergunta) =>
      criarPerguntaElement(pergunta, perguntasHolder),
    );
  }
}
