document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const boardContainer = document.getElementById('boardContainer');
    const classicBtn = document.getElementById('classic-btn');
    const relaxedBtn = document.getElementById('relaxed-btn');
    const sizeInput = document.getElementById('size');
    const messageEl = document.getElementById('message');
    
    // Variables del juego
    let mode = 'classic';
    let queens = [];
    let currentSize = 5;

    // Función para mostrar mensajes
    function showMessage(text, isError = false) {
        messageEl.textContent = text;
        messageEl.className = isError ? 'message error' : 'message success';
        setTimeout(() => messageEl.style.display = 'none', 3000);
    }

    // Función para crear el tablero
    function createBoard() {
        currentSize = parseInt(sizeInput.value);
        boardContainer.innerHTML = '';
        queens = [];
        messageEl.style.display = 'none';
        
        // (Mantén el mismo código de creación de tablero con coordenadas)
        // ... [código previo de createBoard] ...
        
        showMessage(`Modo ${mode} activado. Tablero ${currentSize}x${currentSize} listo!`);
    }

    // Función para validar movimientos
    function validateMove(row, col) {
        if (mode === 'classic') {
            const attacking = queens.some(q => 
                q.row === row || 
                q.col === col || 
                Math.abs(q.row - row) === Math.abs(q.col - col)
            );
            if (attacking) {
                showMessage("¡Error! Reina bajo ataque en modo clásico", true);
                return false;
            }
        } else { // Modo relajado
            const rowCount = queens.filter(q => q.row === row).length;
            const colCount = queens.filter(q => q.col === col).length;
            const diag1Count = queens.filter(q => (q.row - q.col) === (row - col)).length;
            const diag2Count = queens.filter(q => (q.row + q.col) === (row + col)).length;
            
            if (rowCount >= 2 || colCount >= 2 || diag1Count >= 2 || diag2Count >= 2) {
                showMessage("¡Máximo 2 reinas en línea en modo relajado!", true);
                return false;
            }
        }
        return true;
    }

    // Función para colocar reinas
    function placeQueen(row, col) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        
        if (cell.classList.contains('queen')) {
            cell.classList.remove('queen');
            queens = queens.filter(q => !(q.row === row && q.col === col));
            showMessage(`Reina removida en ${String.fromCharCode(65+col)}${row+1}`);
        } else {
            if (validateMove(row, col)) {
                cell.classList.add('queen');
                queens.push({ row, col });
                showMessage(`Reina colocada en ${String.fromCharCode(65+col)}${row+1}`);
                
                // Verificar si se completó el tablero
                if (queens.length === currentSize && mode === 'classic') {
                    showMessage("¡Felicidades! Solución correcta en modo clásico");
                }
            }
        }
    }

    // Event Listeners mejorados
    classicBtn.addEventListener('click', () => {
        mode = 'classic';
        createBoard();
    });

    relaxedBtn.addEventListener('click', () => {
        mode = 'relaxed';
        createBoard();
    });

    sizeInput.addEventListener('change', createBoard);

    // Inicialización
    createBoard();
});
