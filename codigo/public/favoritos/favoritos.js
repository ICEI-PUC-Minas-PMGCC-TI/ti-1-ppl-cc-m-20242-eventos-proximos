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

    console.log('Favoritos:', favoritos);
    console.log('Eventos:', eventos);

    const favoritosDoUsuario = favoritos.filter(fav => String(fav.id_usuario) === String(idUsuario));
    console.log('Favoritos do usuário:', favoritosDoUsuario);

    const eventosFavoritos = eventos.filter(evento =>
      favoritosDoUsuario.some(fav => String(fav.id_evento) === String(evento.id))
    );
    console.log('Eventos favoritos do usuário:', eventosFavoritos);

    const container = document.getElementById('eventosFavoritos');
    container.innerHTML = '';

    if (eventosFavoritos.length === 0) {
      container.innerHTML = '<p>Nenhum evento favorito encontrado.</p>';
    } else {
      eventosFavoritos.forEach(evento => {
        const eventoHTML = `
          <div class="col-12 mb-4">
            <div class="card">
              <div class="row no-gutters">
                <div class="col-md-4">
                  <img src="${evento.imagem}" alt="${evento.nome}" class="card-img" style="height: 200px; object-fit: cover;">
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">${evento.nome}</h5>
                    <p class="card-text">${evento.descricao}</p>
                    <p><strong>Data:</strong> ${evento.data}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        container.innerHTML += eventoHTML;
      });
    }
  } catch (error) {
    console.error('Erro ao buscar os favoritos e eventos:', error);
  }
}

exibirFavoritos(1);

exibirFavoritos(1);
fetchUserName();
