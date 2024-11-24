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

fetchUserName();