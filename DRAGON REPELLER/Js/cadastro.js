document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o comportamento padrão de envio do formulário
  
    const playerName = document.getElementById('playerName').value.trim();
    const playerClass = document.getElementById('playerClass').value;
  
    if (playerName && playerClass) {
      // Salva os dados do jogador no localStorage
      localStorage.setItem('playerName',playerName);
      localStorage.setItem('playerClass', playerClass);
      // Redireciona para o index.html
      window.location.href = 'game.html';
    }
  });
  
