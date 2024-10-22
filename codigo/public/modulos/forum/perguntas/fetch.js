
function carregarPerguntas() {

  fetch('../perguntas.json')
    .then(response => response.json())
    .then(data => {
      const perguntasHolder = document.getElementById('perguntas');


      data.perguntas.forEach(pergunta => {
        const perguntaDiv = document.createElement('div');
        perguntaDiv.classList.add('pergunta_holder');


        perguntaDiv.innerHTML = `
          <h3>${pergunta.pergunta}</h3>
          <p>${pergunta.resumo}</p>
          <button class="btn_respostas" onclick="mostrarResposta(${pergunta.id})">Ver Resposta</button>
          <div class="resposta" id="resposta-${pergunta.id}" style="display: none;">
            <p>${pergunta.respostaCompleta}</p>
          </div>
        `;


        perguntasHolder.appendChild(perguntaDiv);
      });
    })
    .catch(error => console.error('Erro ao carregar perguntas:', error));
}


function mostrarResposta(id) {
  const respostaDiv = document.getElementById(`resposta-${id}`);
  if (respostaDiv.style.display === "none") {
    respostaDiv.style.display = "block";
  } else {
    respostaDiv.style.display = "none";
  }
}


window.onload = carregarPerguntas;
