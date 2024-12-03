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

const usuarioLogadoId = 1; // Simula o usuário logado
const eventoAtualId = 1; // Simula o evento atual na página

function enviarAvaliacao() {
  const nota = parseFloat(document.getElementById("nota").value);
  const comentario = document.getElementById("comentario").value;

  if (!nota && nota !== 0) {
    exibirMensagem("Por favor, selecione uma nota válida.", "red");
    return;
  }

  const novaAvaliacao = {
    usuarioId: usuarioLogadoId,
    eventoId: eventoAtualId,
    nota,
    comentario,
  };

  cadastrarAvaliacao(avaliacoes, usuarios, eventos, novaAvaliacao);
}

function cadastrarAvaliacao(avaliacoes, usuarios, eventos, novaAvaliacao) {
  const { usuarioId, eventoId, nota, comentario } = novaAvaliacao;

  const usuarioExiste = usuarios.some(usuario => usuario.id === usuarioId);
  const eventoExiste = eventos.some(evento => evento.id === eventoId);

  if (!usuarioExiste) {
    exibirMensagem("Erro: Usuário não encontrado.", "red");
    return;
  }

  if (!eventoExiste) {
    exibirMensagem("Erro: Evento não encontrado.", "red");
    return;
  }

  if (nota < 0 || nota > 5) {
    exibirMensagem("Erro: Nota deve estar entre 0 e 5.", "red");
    return;
  }

  const novaId = avaliacoes.length > 0
    ? (parseInt(avaliacoes[avaliacoes.length - 1].id) + 1).toString()
    : "1";
  const dataAtual = new Date().toISOString().split("T")[0];

  const novaEntrada = {
    id: novaId,
    usuarioId,
    eventoId,
    nota,
    comentario: comentario || "",
    dataAvaliacao: dataAtual,
  };

  avaliacoes.push(novaEntrada);

  exibirMensagem("Avaliação cadastrada com sucesso!", "green");
  console.log("Avaliações atualizadas:", avaliacoes); // Apenas para debug
}

function exibirMensagem(mensagem, cor) {
  const mensagemElemento = document.getElementById("mensagem");
  mensagemElemento.style.color = cor;
  mensagemElemento.textContent = mensagem;
}
