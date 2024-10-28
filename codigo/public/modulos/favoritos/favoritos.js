const usuarioAtualId = 1

async function fetchUserName() {
    try{
        const response = await fetch('/codigo/db/db.json')
        const data = await response.json();

        const userName = data.usuarios.nome;
        document.getElementById('user-name').textContent = `Olá, ${userName}`
    } catch (error){
        console.error('Erro ao buscar o nome do usuário:', error)
    }
}

function exibirFavoritos(idUsuario) {
    const favoritosDoUsuario = dados.favoritos.filter(fav => fav.id_usuario === idUsuario);
    const eventosFavoritos = dados.eventos.filter(evento => favoritosDoUsuario.some(fav.id_evento === evento.id));

    const container = document.getElementById('eventosFavoritos');
    container.innerHTML = '';
    eventosFavoritos.forEach(evento => {
        const eventoHTML = `
          <div class="evento">
            <h2>${evento.nome}</h2>
            <p>${evento.descricao}</p>
            <p>Data: ${evento.data}</p>
          </div>
          <hr>
        `;
        container.innerHTML += eventoHTML;
      });
}

exibirFavoritos(usuarioAtualId);

document.addEventListener('DOMContentLoaded', fetchUserName);