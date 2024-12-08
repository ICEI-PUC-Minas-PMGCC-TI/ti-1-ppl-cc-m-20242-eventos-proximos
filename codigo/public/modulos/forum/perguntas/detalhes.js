function obterIdPergunta() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function carregarDetalhePergunta() {
  const perguntaId = obterIdPergunta();

  fetch(`http://localhost:3000/perguntas/${perguntaId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Erro ao buscar a pergunta.');
      }
      return response.json();
    })
    .then((pergunta) => {
      if (pergunta) {
        // Buscar o nome do usuário associado à pergunta
        fetch(`http://localhost:3000/usuarios/${pergunta.id_usuario}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Erro ao buscar o usuário.');
            }
            return response.json();
          })
          .then((usuario) => {
            const detalhePerguntaDiv = document.getElementById('detalhePergunta');
            detalhePerguntaDiv.classList.add('pergunta_holder');

            detalhePerguntaDiv.innerHTML = `
              <h3>Pergunta feita por: ${usuario.nome}</h3>
              <h4>${pergunta.pergunta}</h4>
              <p>${pergunta.respostaCompleta}</p>
              <a class="btn_respostas" href="forum.html">Voltar</a>
            `;
          })
          .catch((error) => {
            console.error('Erro ao carregar o usuário:', error);
            const detalhePerguntaDiv = document.getElementById('detalhePergunta');
            detalhePerguntaDiv.innerHTML = '<p>Erro ao carregar o usuário.</p>';
          });
      } else {
        const detalhePerguntaDiv = document.getElementById('detalhePergunta');
        detalhePerguntaDiv.innerHTML = '<p>Pergunta não encontrada.</p>';
      }
    })
    .catch((error) => {
      console.error('Erro ao carregar a pergunta:', error);
      const detalhePerguntaDiv = document.getElementById('detalhePergunta');
      detalhePerguntaDiv.innerHTML = '<p>Erro ao carregar a pergunta.</p>';
    });
}

window.onload = carregarDetalhePergunta;
