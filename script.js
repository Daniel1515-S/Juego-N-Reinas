document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const boardContainer = document.getElementById('boardContainer');
    const classicBtn = document.getElementById('classic-btn');
    const relaxedBtn = document.getElementById('relaxed-btn');
    const sizeInput = document.getElementById('size');
    
    // Variables del juego
    let mode = 'classic';
    let queens = [];
    let currentSize = 4;

    // Función para crear el tablero
    function createBoard() {
        currentSize = parseInt(sizeInput.value);
        boardContainer.innerHTML = '';
        queens = [];
        
        // Crear tablero con coordenadas (código previo que te envié)
        // ... (implementa la misma función createBoard que te mostré antes)
        
        console.log(`Tablero ${currentSize}x${currentSize} creado en modo ${mode}`);
    }

    // Función para cambiar de modo
    function setGameMode(newMode) {
        mode = newMode;
        createBoard();
        alert(`Modo ${mode} activado. ¡Comienza el juego!`);
    }

    // Event Listeners
    classicBtn.addEventListener('click', () => setGameMode('classic'));
    relaxedBtn.addEventListener('click', () => setGameMode('relaxed'));
    sizeInput.addEventListener('change', createBoard);

    // Inicialización
    createBoard();
});
