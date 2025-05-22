document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const boardContainer = document.getElementById('board-container');
    const classicBtn = document.getElementById('classic-btn');
    const relaxedBtn = document.getElementById('relaxed-btn');
    const sizeInput = document.getElementById('size');
    const queensInput = document.getElementById('queens');
    const queensControl = document.getElementById('queens-control');
    const messageEl = document.getElementById('message');
    
    // Variables del juego
    let mode = 'classic';
    let queens = [];
    let currentSize = 4;
    let targetQueens = 4;

    // Función para mostrar mensajes
    function showMessage(text, isError = false) {
        messageEl.textContent = text;
        messageEl.className = `message ${isError ? 'error' : 'success'}`;
        setTimeout(() => messageEl.style.display = 'none', 4000);
    }

    // Actualizar controles según modo
    function updateControls() {
        currentSize = parseInt(sizeInput.value);
        
        if (mode === 'classic') {
            targetQueens = currentSize;
            queensInput.value = currentSize;
            queensInput.max = currentSize;
            queensControl.style.opacity = '0.5';
            queensInput.disabled = true;
        } else {
            targetQueens = currentSize - 1;
            queensInput.value = currentSize - 1;
            queensInput.max = currentSize;
            queensControl.style.opacity = '1';
            queensInput.disabled = false;
        }
    }

    // Función para crear el tablero
    function createBoard() {
        updateControls();
        boardContainer.innerHTML = '';
        queens = [];
        
        // Crear contenedor principal
        const boardWrapper = document.createElement('div');
        boardWrapper.className = 'board-wrapper';
        
        // Coordenadas superiores (letras)
        const topLabels = document.createElement('div');
        topLabels.className = 'coords top-coords';
        for (let i = 0; i < currentSize; i++) {
            const label = document.createElement('div');
            label.textContent = String.fromCharCode(65 + i);
            topLabels.appendChild(label);
        }
        
        // Coordenadas laterales (números)
        const sideLabels = document.createElement('div');
        sideLabels.className = 'coords side-coords';
        for (let i = 0; i < currentSize; i++) {
            const label = document.createElement('div');
            label.textContent = i + 1;
            sideLabels.appendChild(label);
        }
        
        // Crear tablero
        const board = document.createElement('div');
        board.className = 'board';
        board.style.setProperty('--size', currentSize);
        
        for (let i = 0; i < currentSize; i++) {
            for (let j = 0; j < currentSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', () => placeQueen(i, j));
                board.appendChild(cell);
            }
        }
        
        // Ensamblar todo
        boardWrapper.appendChild(topLabels);
        const middleRow = document.createElement('div');
        middleRow.style.display = 'flex';
        middleRow.appendChild(sideLabels);
        middleRow.appendChild(board);
        boardWrapper.appendChild(middleRow);
        boardContainer.appendChild(boardWrapper);
        
        showMessage(`Modo ${mode}. Coloca ${targetQueens} reinas sin que se ataquen.`);
    }

    // Función para colocar reinas
    function placeQueen(row, col) {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        
        if (cell.classList.contains('queen')) {
            cell.classList.remove('queen');
            queens = queens.filter(q => !(q.row === row && q.col === col));
            showMessage(`Reina removida de ${String.fromCharCode(65+col)}${row+1}`);
        } else {
            if (queens.length >= targetQueens) {
                showMessage(`¡Solo puedes colocar ${targetQueens} reinas!`, true);
                return;
            }
            
            if (validateMove(row, col)) {
                cell.classList.add('queen');
                queens.push({ row, col });
                showMessage(`Reina colocada en ${String.fromCharCode(65+col)}${row+1} (${queens.length}/${targetQueens})`);
                
                if (queens.length === targetQueens) {
                    if (mode === 'classic') {
                        showMessage("¡Felicidades! Solución correcta en modo clásico");
                    } else {
                        showMessage("¡Configuración completada en modo relajado!");
                    }
                }
            }
        }
    }

    // Función para validar movimientos
    function validateMove(row, col) {
        if (mode === 'classic') {
            const isAttacked = queens.some(q => 
                q.row === row || 
                q.col === col || 
                Math.abs(q.row - row) === Math.abs(q.col - col)
            );
            if (isAttacked) {
                showMessage("¡Error! Reina bajo ataque en modo clásico", true);
                return false;
            }
        } else {
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

    // Event Listeners
    classicBtn.addEventListener('click', () => {
        mode = 'classic';
        classicBtn.classList.add('active');
        relaxedBtn.classList.remove('active');
        updateControls();
        createBoard();
    });

    relaxedBtn.addEventListener('click', () => {
        mode = 'relaxed';
        relaxedBtn.classList.add('active');
        classicBtn.classList.remove('active');
        updateControls();
        createBoard();
    });

    sizeInput.addEventListener('change', () => {
        updateControls();
        createBoard();
    });

    queensInput.addEventListener('change', () => {
        if (mode === 'relaxed') {
            targetQueens = Math.min(parseInt(queensInput.value), currentSize);
            queensInput.value = targetQueens;
            createBoard();
        }
    });

    // Inicialización
    classicBtn.classList.add('active');
    updateControls();
    createBoard();
});
