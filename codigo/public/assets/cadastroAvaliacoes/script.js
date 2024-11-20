function cadastrarAvaliacao(avaliacoes, usuarios, eventos, novaAvaliacao) {
    const { usuarioId, eventoId, nota, comentario } = novaAvaliacao;
  
    const usuarioExiste = usuarios.some(usuario => usuario.id === usuarioId);
    const eventoExiste = eventos.some(evento => evento.id === eventoId);
  
    if (!usuarioExiste) {
      console.log("Erro: Usuário não encontrado.");
      return;
    }
  
    if (!eventoExiste) {
      console.log("Erro: Evento não encontrado.");
      return;
    }
  
    if (nota < 0 || nota > 5) {
      console.log("Erro: Nota deve estar entre 0 e 5.");
      return;
    }
  
    const novaId = avaliacoes.length > 0 ? avaliacoes[avaliacoes.length - 1].id + 1 : 1;
    const dataAtual = new Date().toISOString().split('T')[0];
  
    const novaEntrada = {
      id: novaId,
      usuarioId,
      eventoId,
      nota,
      comentario: comentario || "", 
      dataAvaliacao: dataAtual,
    };
  
    avaliacoes.push(novaEntrada);
  
    console.log("Avaliação cadastrada com sucesso:", novaEntrada);
  }
  
  const novaAvaliacao = {
    usuarioId: 3,
    eventoId: 5,
    nota: 4.8,
    comentario: "Evento incrível, superou minhas expectativas!"
  };
  
  cadastrarAvaliacao(json.avaliacoes, json.usuarios, json.eventos, novaAvaliacao);
  