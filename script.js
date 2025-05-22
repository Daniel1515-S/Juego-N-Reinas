document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const classicBtn = document.getElementById('classic-btn');
    const relaxedBtn = document.getElementById('relaxed-btn');
    const sizeInput = document.getElementById('size');
    let mode = 'classic'; // 'classic' o 'relaxed'

    // Crear tablero inicial
    function createBoard() {
        const size = parseInt(sizeInput.value);
        board.innerHTML = '';
        board.style.gridTemplateColumns = `repeat(${size}, 60px)`;
        
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
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
        } else {
            cell.classList.add('queen');
        }
    }

    // Event listeners para los botones
    classicBtn.addEventListener('click', () => {
        mode = 'classic';
        alert('Modo Clásico: Ninguna reina puede atacarse');
        createBoard();
    });

    relaxedBtn.addEventListener('click', () => {
        mode = 'relaxed';
        alert('Modo Relajado: Máximo 2 reinas en línea');
        createBoard();
    });

    sizeInput.addEventListener('change', createBoard);
    createBoard(); // Inicializar tablero al cargar
});
