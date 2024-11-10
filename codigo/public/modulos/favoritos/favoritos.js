async function fetchUserName() {
  try {
      const response = await fetch("http://localhost:3000/usuarios"); 
      const data = await response.json();

      if (data.length > 0) { 
          const userName = data[0].nome; 
          document.getElementById('user-name').textContent = `Olá, ${userName}`;
      } else {
          console.warn('Nenhum usuário encontrado');
      }
  } catch (error) {
      console.error('Erro ao buscar o nome do usuário:', error);
  }
}

async function exibirFavoritos(idUsuario) {
    try {
      const favoritosResponse = await fetch("http://localhost:3000/favoritos");
      const eventosResponse = await fetch("http://localhost:3000/eventos");
  
      const favoritos = await favoritosResponse.json();
      const eventos = await eventosResponse.json();
  
      // Debug: Verificar se os dados foram carregados
      console.log('Favoritos:', favoritos);
      console.log('Eventos:', eventos);
  
      const favoritosDoUsuario = favoritos.filter(fav => fav.id_usuario === idUsuario);
      console.log('Favoritos do usuário:', favoritosDoUsuario); // Verifique se há favoritos
  
      const eventosFavoritos = eventos.filter(evento => favoritosDoUsuario.some(fav => fav.id_evento === evento.id));
      console.log('Eventos favoritos do usuário:', eventosFavoritos); // Verifique se há eventos correspondentes
  
      const container = document.getElementById('eventosFavoritos');
      container.innerHTML = '';
  
      if (eventosFavoritos.length === 0) {
        container.innerHTML = '<p>Nenhum evento favorito encontrado.</p>';
      } else {
        eventosFavoritos.forEach(evento => {
          const eventoHTML = `
            <div class="evento">
              <img src="${evento.imagem}" alt="${evento.nome}" width="100px">
              <h2>${evento.nome}</h2>
              <p>${evento.descricao}</p>
              <p>Data: ${evento.data}</p>
            </div>
            <hr>
          `;
          container.innerHTML += eventoHTML;
        });
      }
    } catch (error) {
      console.error('Erro ao buscar os favoritos e eventos:', error);
    }
  }

exibirFavoritos(1);
fetchUserName();