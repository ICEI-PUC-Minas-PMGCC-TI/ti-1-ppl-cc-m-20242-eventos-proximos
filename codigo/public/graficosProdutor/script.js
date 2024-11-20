// Função para exibir a tela selecionada
function mostrarTela(tela) {
    // Esconde todas as telas
    const containers = document.querySelectorAll('.container');
    containers.forEach(container => container.classList.remove('active'));

    // Mostra a tela ativa
    const telaAtiva = document.getElementById(tela);
    telaAtiva.classList.add('active');
}

// Exibe a tela "Meus Eventos" por padrão ao carregar
mostrarTela('meusEventos');


// Código da funcionalidade de gráfico para personalizar
function createBarChart(data) {
    // ------------------------------------------------
    // Agrupa os dados por mês e categoria para serem utilizados no gráfico
    const meses = Array.from(new Set(data.map(item => item.mes)));
    const categorias = Array.from(new Set(data.map(item => item.categoria)));

    const dadosPorMes = meses.map(mes => {
      const valoresPorCategoria = categorias.map(categoria => {
        const valor = data.filter(item => item.mes === mes && item.categoria === categoria)
                           .reduce((acc, curr) => acc + curr.valor, 0);
        return valor;
      });
      return {
        mes: mes,
        valores: valoresPorCategoria
      };
    });

    // ------------------------------------------------
    // Monta o gráfico utilizando a API do ChartJS

    const cores = [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)'
        ];            
    const ctx = document.getElementById('divBarChart');
    const divBarChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: meses,
        datasets: categorias.map((categoria, index) => {
            return {
                label: categoria,
                data: dadosPorMes.map(item => item.valores[index]),
                backgroundColor: cores[index],
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            };
        })
      },
      options: {
            scales: {
                y: {
                    beginAtZero: true,
                    stacked: true
                },
                x: {
                    stacked: true
                }
            }
      }
    });
}    

function createPieChart (data) {
    const categorias = Array.from(new Set(data.map(item => item.categoria)));

    const valoresPorCategoria = categorias.map(categoria => {
    const valorTotal = data.filter(item => item.categoria === categoria)
                            .reduce((acc, curr) => acc + curr.valor, 0);
    return valorTotal;
    });

    const ctx = document.getElementById('divPieChart');
    const divPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: categorias,
        datasets: [{
        data: valoresPorCategoria,
        backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
        }]
    },
    options: {
        responsive: false,
        maintainAspectRatio: false
    }
    });            
}