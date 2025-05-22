document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const message = document.getElementById('message');
    const sizeInput = document.getElementById('size');
    const classicBtn = document.getElementById('classic-btn');
    const relaxBtn = document.getElementById('relaxed-btn');

    let queens = [];
    let boardSize = 4;
    let mode = 'classic'; // 'classic' o 'relaxed'

    // Crear tablero inicial
    function createBoard() {
        boardSize = parseInt(sizeInput.value);
        board.style.setProperty('--size', boardSize);
        board.innerHTML = '';
        queens = [];

        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', () => placeQueen(i, j));
                board.appendChild(cell);
            }
        }
    }

    // Colocar o quitar reina
    function placeQueen(row, col) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        
        if (cell.classList.contains('queen')) {
            cell.classList.remove('queen');
            queens = queens.filter(q => !(q.row === row && q.col === col));
            message.textContent = '';
            return;
        }

        // Validar según el modo
        if (mode === 'classic' && !isValidClassic(row, col)) {
            message.textContent = '¡Movimiento inválido en modo clásico!';
            return;
        }

        if (mode === 'relaxed' && !isValidRelaxed(row, col)) {
            message.textContent = '¡Máximo 2 reinas en fila/columna/diagonal!';
            return;
        }

        cell.classList.add('queen');
        queens.push({ row, col });
        message.textContent = '';
    }

    // Validar modo clásico
    function isValidClassic(row, col) {
        return queens.every(q => 
            q.row !== row && 
            q.col !== col && 
            Math.abs(q.row - row) !== Math.abs(q.col - col)
        );
    }

    // Validar modo relajado
    function isValidRelaxed(row, col) {
        const rowCount = queens.filter(q => q.row === row).length;
        const colCount = queens.filter(q => q.col === col).length;
        const diag1Count = queens.filter(q => (q.row - q.col) === (row - col)).length;
        const diag2Count = queens.filter(q => (q.row + q.col) === (row + col)).length;

        return rowCount < 2 && colCount < 2 && diag1Count < 2 && diag2Count < 2;
    }

    // Event listeners
    classicBtn.addEventListener('click', () => {
        mode = 'classic';
        message.textContent = 'Modo Clásico: Ninguna reina puede atacarse.';
        createBoard();
    });

    relaxBtn.addEventListener('click', () => {
        mode = 'relaxed';
        message.textContent = 'Modo Relajado: Máximo 2 reinas alineadas.';
        createBoard();
    });

    sizeInput.addEventListener('change', createBoard);

    // Inicializar
    createBoard();
});
