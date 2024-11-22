document.addEventListener('DOMContentLoaded', () => {

  fetch('../../db/db.json')
    .then(response => response.json())
    .then(data => {
      const usuarioId = 1;
      const favoritosUsuario = data.favoritos.filter(fav => fav.id_usuario === usuarioId);
      const idsFavoritos = favoritosUsuario.map(fav => fav.id_evento);

      // filtra as notificaçoes com base nos favoritos 
      const notificacoesFiltradas = data.notificacoes.filter(notificacao =>
        idsFavoritos.includes(notificacao.notificacoesId)
      );

      //onde vai carregara s informaçoes json
      const mainElement = document.querySelector('.main');

      //itera em notificacoesFIltradas que contém as notificações que correspondem aos eventos favoritos do usuário

      notificacoesFiltradas.forEach(notificacao => {
        const notificationElement = document.createElement('div');
        notificationElement.classList.add('notification');

        notificationElement.innerHTML = `
          <label class="notification-item">
            <input type="checkbox" class="notification-checkbox" ${notificacao.lido ? 'checked' : ''}>
            <div class="notification-box">
              <h3 class="notification-title">${notificacao.titulo}</h3>
              <p class="notification-desc">${notificacao.desc}</p>
              <a href="${notificacao.link}" class="notification-link">Ver mais</a>
            </div>
            <button class="delete-button">Excluir</button>
          </label>
        `;

        mainElement.appendChild(notificationElement);

        // Deleta a notificacao da lista 
        const deleteButton = notificationElement.querySelector('.delete-button');
        deleteButton.addEventListener('click', () => {
          notificationElement.remove();

          // remove a notificação do json apenas na memoria javascript 
          const index = data.notificacoes.findIndex(notif => notif.notificacoesId === notificacao.notificacoesId);
          if (index !== -1) {
            data.notificacoes.splice(index, 1);
            console.log(`Notificação ${notificacao.notificacoesId} removida do array.`);
          }
        });

        // atualiza o checkbox para true ou false na memoria 
        const checkbox = notificationElement.querySelector('.notification-checkbox');
        checkbox.addEventListener('change', () => {
          notificacao.lido = checkbox.checked;
          console.log(`Notificação ${notificacao.notificacoesId} atualizada para: ${notificacao.lido}`);
        });
      });
    })
    .catch(error => {
      console.error('Erro ao carregar os dados:', error);
    });
});
