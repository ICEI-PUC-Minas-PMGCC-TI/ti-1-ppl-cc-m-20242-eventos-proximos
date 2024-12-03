const avaliacoes = [
  {
      id: "1",
      usuarioId: 1,
      eventoId: 1,
      nota: 4.5,
      comentario: "Evento bem organizado e com boa seleção de bandas!",
      dataAvaliacao: "2024-11-16",
  },
  {
      id: "2",
      usuarioId: 2,
      eventoId: 2,
      nota: 3,
      comentario: "Gostei, mas poderia ter mais opções de alimentação.",
      dataAvaliacao: "2024-11-16",
  },
];

const usuarios = [{ id: 1, nome: "João" }, { id: 2, nome: "Maria" }];
const eventos = [
  { id: 1, nome: "Festival de Música" },
  { id: 2, nome: "Feira de Artesanato" },
];

const usuarioLogadoId = 2; // Simula o usuário logado
const eventoAtualId = 1; // Simula o evento atual na página

// Função para exibir as avaliações de outros usuários e o comentário do usuário logado
function exibirComentarios() {
  const commentDisplay = document.getElementById("user-comments");
  commentDisplay.innerHTML = ""; // Limpa os comentários anteriores

  // Exibir avaliação do usuário logado
  if (usuarioLogadoId) {
      const comentarioUsuarioLogado = avaliacoes.find(avaliacao => avaliacao.usuarioId === usuarioLogadoId && avaliacao.eventoId === eventoAtualId);
      if (comentarioUsuarioLogado) {
          const comentarioElement = document.createElement("div");
          comentarioElement.classList.add("comment");
          comentarioElement.innerHTML = `
              <p><strong>Você</strong> avaliou com ${comentarioUsuarioLogado.nota} estrelas</p>
              <p><strong>Comentário:</strong> ${comentarioUsuarioLogado.comentario}</p>
              <p><strong>Data:</strong> ${comentarioUsuarioLogado.dataAvaliacao}</p>
          `;
          commentDisplay.appendChild(comentarioElement);
      }
  }

  // Exibir avaliações de outros usuários
  avaliacoes.forEach(avaliacao => {
      if (avaliacao.eventoId === eventoAtualId && avaliacao.usuarioId !== usuarioLogadoId) {
          const usuario = usuarios.find(u => u.id === avaliacao.usuarioId);
          const reviewElement = document.createElement("div");
          reviewElement.classList.add("review");
          reviewElement.innerHTML = `
              <p><strong>${usuario.nome}</strong> avaliou com ${avaliacao.nota} estrelas</p>
              <p><strong>Comentário:</strong> ${avaliacao.comentario}</p>
              <p><strong>Data:</strong> ${avaliacao.dataAvaliacao}</p>
          `;
          commentDisplay.appendChild(reviewElement);
      }
  });
}

// Função para enviar avaliação
function enviarAvaliacao(event) {
  event.preventDefault();

  const nota = parseFloat(document.getElementById("rating").value);
  const comentario = document.getElementById("comment").value;

  // Simula a criação de uma nova avaliação
  const novaAvaliacao = {
      id: `${avaliacoes.length + 1}`,
      usuarioId: usuarioLogadoId,
      eventoId: eventoAtualId,
      nota: nota,
      comentario: comentario,
      dataAvaliacao: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
  };
  avaliacoes.push(novaAvaliacao);
  
  // Exibir novamente as avaliações
  exibirComentarios();

  // Limpar formulário
  document.getElementById("rating").value = "";
  document.getElementById("comment").value = "";
}

document.getElementById("rating-form").addEventListener("submit", enviarAvaliacao);

// Exibe as avaliações ao carregar a página
document.addEventListener("DOMContentLoaded", exibirComentarios);
