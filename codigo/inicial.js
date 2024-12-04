document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:3000/eventos")
      .then(response => response.json())
      .then(data => {
          console.log(data);

          const carouselInner = document.querySelector(".carousel-inner");
          let groupCount = 0;

          const eventosComImagem = data.filter(evento => evento.imagem && evento.imagem.trim() !== "");

          for (let i = 0; i < eventosComImagem.length; i += 3) {
              const carouselItem = document.createElement("div");
              carouselItem.classList.add("carousel-item");

              if (groupCount === 0) {
                  carouselItem.classList.add("active");
              }

              const row = document.createElement("div");
              row.classList.add("row");

              eventosComImagem.slice(i, i + 3).forEach(evento => {
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
  
          const link = document.createElement("a");
          link.href = `../public/descEventos/descEventos.html?id=${evento.id}`;
          link.classList.add("link-desc");
  
          const img = document.createElement("img");
          img.src = evento.imagem;
          img.alt = `Imagem do evento ${evento.nome}`;
          img.classList.add("evento-img");
          link.appendChild(img);
  
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

          eventosContainer.appendChild(eventoDiv);
        });
      })
      .catch(error => console.error("Erro ao carregar os eventos:", error));
  });

  document.addEventListener("DOMContentLoaded", function () {
    const eventosContainer = document.querySelector(".eventos-container");
    const searchInput = document.getElementById("search-input");
    let eventosData = []; // Para armazenar os dados dos eventos

    // Função para carregar os eventos
    function carregarEventos(data) {
        eventosContainer.innerHTML = ''; // Limpa a área de eventos antes de adicionar novos
        data.forEach(evento => {
            const eventoDiv = document.createElement("div");
            eventoDiv.classList.add("eventos");

            const link = document.createElement("a");
            link.href = `../public/descEventos/descEventos.html?id=${evento.id}`;
            link.classList.add("link-desc");

            const img = document.createElement("img");
            img.src = evento.imagem;
            img.alt = `Imagem do evento ${evento.nome}`;
            img.classList.add("evento-img");
            link.appendChild(img);

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

            eventosContainer.appendChild(eventoDiv);
        });
    }

    function pesquisarEventos(query) {
        
        const filteredEventos = eventosData.filter(evento => 
            evento.nome.toLowerCase().includes(query.toLowerCase())
        );
        carregarEventos(filteredEventos); 
    }

    fetch("http://localhost:3000/eventos")
        .then(response => response.json())
        .then(data => {
            eventosData = data; 
            carregarEventos(data); 
        })
        .catch(error => console.error("Erro ao carregar os eventos:", error));

    searchInput.addEventListener("input", function () {
        const query = searchInput.value;

        if (query) {
            pesquisarEventos(query); 
        } else {
            carregarEventos(eventosData); 
        }
    });
});
