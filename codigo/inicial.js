document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3000/eventos")
      .then(response => response.json())
      .then(data => {
        console.log(data); 
        const carouselInner = document.querySelector(".carousel-inner");
        let groupCount = 0;
  
        for (let i = 0; i < data.length; i += 3) {
          const carouselItem = document.createElement("div");
          carouselItem.classList.add("carousel-item");
  
          if (groupCount === 0) {
            carouselItem.classList.add("active");
          }
  
          const row = document.createElement("div");
          row.classList.add("row");
  
          data.slice(i, i + 3).forEach(evento => {
            const col = document.createElement("div");
            col.classList.add("col-md-4");
            col.innerHTML = `
              <img src="${evento.imagem}" class="d-block w-100" alt="${evento.nome}">
            `;
            row.appendChild(col);
          });
  
          carouselItem.appendChild(row);
          carouselInner.appendChild(carouselItem);
  
          groupCount++;
        }
      })
      .catch(error => console.error("Erro ao carregar os eventos:", error));
  });

  document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3000/eventos")
      .then(response => response.json())
      .then(data => {
        const eventosContainer = document.querySelector(".eventos-container");

        const ultimosEventos = data.slice(-3);
  
        ultimosEventos.forEach(evento => {

          const eventoDiv = document.createElement("div");
          eventoDiv.classList.add("eventos");
  
          // Cria o link
          const link = document.createElement("a");
          link.href = `../public/descEventos/descEventos.html?id=${evento.id}`;
          link.classList.add("link-desc");
  
          // Cria e adiciona a imagem
          const img = document.createElement("img");
          img.src = evento.imagem;
          img.alt = `Imagem do evento ${evento.nome}`;
          img.classList.add("evento-img");
          link.appendChild(img);
  
          // Cria e adiciona o texto
          const textoDiv = document.createElement("div");
          textoDiv.classList.add("eventos-txt");
  
          const titulo = document.createElement("h2");
          titulo.textContent = evento.nome;
          textoDiv.appendChild(titulo);
  
          const descricao = document.createElement("p");
          descricao.textContent = evento.descricao;
          textoDiv.appendChild(descricao);
  
          link.appendChild(textoDiv);
          eventoDiv.appendChild(link);
  
          // Adiciona o evento ao contêiner
          eventosContainer.appendChild(eventoDiv);
        });
      })
      .catch(error => console.error("Erro ao carregar os eventos:", error));
  });
  
  