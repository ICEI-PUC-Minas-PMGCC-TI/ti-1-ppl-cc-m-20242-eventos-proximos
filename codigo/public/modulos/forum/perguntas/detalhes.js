function obterIdPergunta() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function carregarDetalhePergunta() {
  const perguntaId = obterIdPergunta();

  const perguntasJson = localStorage.getItem('perguntas');
  if (!perguntasJson) {
    console.error('Não há perguntas salvas no localStorage.');
    return;
  }

  const data = JSON.parse(perguntasJson);
  const pergunta = data.perguntas.find((p) => p.id == perguntaId);
  const detalhePerguntaDiv = document.getElementById('detalhePergunta');
  detalhePerguntaDiv.classList.add('pergunta_holder');

  if (pergunta) {
    detalhePerguntaDiv.innerHTML = `
      <h3>${pergunta.pergunta}</h3>
      <p>${pergunta.respostaCompleta}</p>
      <a class="btn_respostas" href="forum.html">Voltar</a>
    `;
  } else {
    detalhePerguntaDiv.innerHTML = '<p>Pergunta não encontrada.</p>';
  }
}

window.onload = carregarDetalhePergunta;
