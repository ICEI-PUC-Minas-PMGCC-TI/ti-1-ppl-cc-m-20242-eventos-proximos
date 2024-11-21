document.addEventListener('DOMContentLoaded', () => {
    
    fetch('db.json')
      .then(response => response.json())
      .then(data => {
        // Suponha que o id_usuario seja 1
        const usuarioId = 1;
  
        const favoritosUsuario = data.favoritos.filter(fav => fav.id_usuario === usuarioId);
        const idsFavoritos = favoritosUsuario.map(fav => fav.id_evento);
  
        const notificacoesFiltradas = data.notificacoes.filter(notificacao => 
          idsFavoritos.includes(notificacao.notificacoesId)
        );
  
        const mainElement = document.querySelector('.main');

        
        notificacoesFiltradas.forEach(notificacao => {
          const notificationElement = document.createElement('div');
          notificationElement.classList.add('notification');
  
          notificationElement.innerHTML = `
            <label class="notification-item">
              <input type="checkbox" class="notification-checkbox">
              <div class="notification-box">
                <h3 class="notification-title">${notificacao.titulo}</h3>
                <p class="notification-desc">${notificacao.desc}</p>
                <a href="${notificacao.link}" class="notification-link">Ver mais</a>
              </div>
              <button class="delete-button">Excluir</button>
            </label>
          `;
  
      
          mainElement.appendChild(notificationElement);
  
        
          const deleteButton = notificationElement.querySelector('.delete-button');
          deleteButton.addEventListener('click', () => {
            notificationElement.remove(); 
          });
        });
      })
      .catch(error => {
        console.error('Erro ao carregar o arquivo db.json:', error);
      });
  });
  