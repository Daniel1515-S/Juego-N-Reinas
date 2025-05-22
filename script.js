document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const boardContainer = document.getElementById('boardContainer');
    const classicBtn = document.getElementById('classic-btn');
    const relaxedBtn = document.getElementById('relaxed-btn');
    const sizeInput = document.getElementById('size');
    
    // Variables del juego
    let mode = 'classic';
    let queens = [];
    let currentSize = 5;

    // Función para crear el tablero
    function createBoard() {
        currentSize = parseInt(sizeInput.value);
        boardContainer.innerHTML = '';
        queens = [];
        
        // Crear contenedor principal
        const boardWrapper = document.createElement('div');
        boardWrapper.className = 'board-wrapper';
        
        // Crear coordenadas superiores (letras)
        const topLabels = document.createElement('div');
        topLabels.className = 'coords top-coords';
        for (let i = 0; i < currentSize; i++) {
            const label = document.createElement('div');
            label.textContent = String.fromCharCode(65 + i); // A, B, C...
            topLabels.appendChild(label);
        }
        
        // Crear coordenadas laterales (números)
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
    }

    // Función para colocar/quitar reinas
    function placeQueen(row, col) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        
        if (cell.classList.contains('queen')) {
            cell.classList.remove('queen');
            queens = queens.filter(q => !(q.row === row && q.col === col));
        } else {
            if (mode === 'classic' && !isValidClassic(row, col)) {
                alert('¡Movimiento inválido en modo clásico!');
                return;
            }
            
            if (mode === 'relaxed' && !isValidRelaxed(row, col)) {
                alert('¡Máximo 2 reinas en línea en modo relajado!');
                return;
            }
            
            cell.classList.add('queen');
            queens.push({ row, col });
        }
    }

    // Validación para modo clásico
    function isValidClassic(row, col) {
        return queens.every(q => 
            q.row !== row && 
            q.col !== col && 
            Math.abs(q.row - row) !== Math.abs(q.col - col)
        );
    }

    // Validación para modo relajado
    function isValidRelaxed(row, col) {
        const rowCount = queens.filter(q => q.row === row).length;
        const colCount = queens.filter(q => q.col === col).length;
        const diag1Count = queens.filter(q => (q.row - q.col) === (row - col)).length;
        const diag2Count = queens.filter(q => (q.row + q.col) === (row + col)).length;

        return rowCount < 2 && colCount < 2 && diag1Count < 2 && diag2Count < 2;
    }

    // Event Listeners
    classicBtn.addEventListener('click', () => {
        mode = 'classic';
        createBoard();
        alert('Modo Clásico: Ninguna reina puede atacarse');
    });

    relaxedBtn.addEventListener('click', () => {
        mode = 'relaxed';
        createBoard();
        alert('Modo Relajado: Máximo 2 reinas en línea');
    });

    sizeInput.addEventListener('change', createBoard);

    // Inicialización
    createBoard();
});
