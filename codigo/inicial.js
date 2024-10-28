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
  