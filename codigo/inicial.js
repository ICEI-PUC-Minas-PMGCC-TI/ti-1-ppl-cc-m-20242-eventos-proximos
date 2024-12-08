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
    let eventosData = []; 

    function carregarEventos(data) {
        eventosContainer.innerHTML = ''; 
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

//
document.addEventListener("DOMContentLoaded", function () {
    const carrossel = document.getElementById("carrossel");
    const prevButton = document.querySelector(".carrossel-prev");
    const nextButton = document.querySelector(".carrossel-next");
    let categoriasData = []; 
    let categoriaSelecionada = null; 

    fetch("http://localhost:3000/categorias") 
    .then(response => response.json())
    .then(data => {
        console.log(data); 
        categoriasData = data;
        carregarCategorias();
    })
    .catch(error => console.error("Erro ao carregar categorias:", error));

    function carregarCategorias() {
        console.log("Carregando categorias..."); 
        carrossel.innerHTML = ''; 
    
        categoriasData.forEach(categoria => {
            console.log(categoria); 
            const categoriaDiv = document.createElement("div");
            categoriaDiv.classList.add("carrossel-item");
            categoriaDiv.dataset.id = categoria.id; 

            const categoriaNome = document.createElement("h3");
            categoriaNome.textContent = categoria.tipo; 
            categoriaDiv.appendChild(categoriaNome); 
    
            carrossel.appendChild(categoriaDiv);
        });

        const categorias = document.querySelectorAll(".carrossel-item");
        categorias.forEach(categoria => {
            categoria.addEventListener("click", function () {
                categoriaSelecionada = parseInt(this.dataset.id, 10); 
                filtrarEventos(); 
            });
        });
    }

    function carregarEventos(data) {
        const eventosContainer = document.querySelector(".eventos-container");
        eventosContainer.innerHTML = ''; 
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

    function filtrarEventos() {
        const eventosContainer = document.querySelector(".eventos-container");
        let eventosFiltrados = eventosData;
    
        if (categoriaSelecionada) {
            eventosFiltrados = eventosData.filter(evento => evento.id_categoria === categoriaSelecionada);
        }
    
        if (eventosFiltrados.length === 0) {
            
            eventosContainer.innerHTML = `
                <div class="mensagem-sem-eventos">
                    Ops... Parece que ainda não temos eventos dessa categoria na Eventful.
                </div>`;
        } else {
            carregarEventos(eventosFiltrados);
        }
    }

    let scrollPosition = 0;
    const scrollAmount = carrossel.clientWidth / 2; 

    prevButton.addEventListener("click", () => {
        scrollPosition = Math.max(scrollPosition - scrollAmount, 0);
        carrossel.scrollTo({ left: scrollPosition, behavior: "smooth" });
    });

    nextButton.addEventListener("click", () => {
        scrollPosition = Math.min(
            scrollPosition + scrollAmount,
            carrossel.scrollWidth - carrossel.clientWidth
        );
        carrossel.scrollTo({ left: scrollPosition, behavior: "smooth" });
    });

    fetch("http://localhost:3000/categorias") 
    .then(response => response.json())
    .then(data => {
        console.log(data); 
        categoriasData = data;
        carregarCategorias();
    })
    .catch(error => console.error("Erro ao carregar categorias:", error));

    fetch("http://localhost:3000/eventos") 
        .then(response => response.json())
        .then(data => {
            eventosData = data; 
            carregarEventos(data); 
        })
        .catch(error => console.error("Erro ao carregar os eventos:", error));
});

document.addEventListener('DOMContentLoaded', () => {
    const locationFilter = document.getElementById('locationFilter');

    locationFilter.addEventListener('change', (event) => {
        if (event.target.value === 'mapa') {
            window.location.href = '/codigo/public/mapaEventos/mapa.html';
        }
    });
});


