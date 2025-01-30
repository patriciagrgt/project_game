document.addEventListener('DOMContentLoaded', () => {
    const instructionsButton = document.getElementById('instructions-button');
    const instructionsModal = document.getElementById('instructions-modal');
    const closeInstructions = document.getElementById('close-instructions');
  
    // Abrir el modal de instrucciones
    instructionsButton.addEventListener('click', () => {
      instructionsModal.classList.add('show');
    });
  
    // Cerrar el modal de instrucciones
    closeInstructions.addEventListener('click', () => {
      instructionsModal.classList.remove('show');
    });
  });