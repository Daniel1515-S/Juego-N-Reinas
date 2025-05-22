document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const classicBtn = document.getElementById('classic-btn');
    const relaxedBtn = document.getElementById('relaxed-btn');
    const sizeInput = document.getElementById('size');
    let mode = 'classic'; // 'classic' o 'relaxed'

    // Crear tablero inicial
function createBoard() {
    const size = parseInt(sizeInput.value);
    boardContainer.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${size}, 60px)`;
        const boardWrapper = document.createElement('div');
    boardWrapper.className = 'board-wrapper';
        
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

    // Crear coordenadas superiores (letras)
    const topLabels = document.createElement('div');
    topLabels.className = 'coords top-coords';
    for (let i = 0; i < size; i++) {
        const label = document.createElement('div');
        label.textContent = String.fromCharCode(65 + i); // A, B, C...
        topLabels.appendChild(label);
    }

    // Crear coordenadas laterales (números)
    const sideLabels = document.createElement('div');
    sideLabels.className = 'coords side-coords';
    for (let i = 0; i < size; i++) {
        const label = document.createElement('div');
        label.textContent = i + 1;
        sideLabels.appendChild(label);
    
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

  // Crear tablero
    const board = document.createElement('div');
    board.className = 'board';
    board.style.setProperty('--size', size);
    
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
    
    // Ensamblar todo
    boardWrapper.appendChild(topLabels);
    const middleRow = document.createElement('div');
    middleRow.style.display = 'flex';
    middleRow.appendChild(sideLabels);
    middleRow.appendChild(board);
    boardWrapper.appendChild(middleRow);
    boardContainer.appendChild(boardWrapper);
}

document.addEventListener('DOMContentLoaded', () => {
    const boardContainer = document.getElementById('boardContainer');
    const classicBtn = document.getElementById('classic-btn');
    const relaxedBtn = document.getElementById('relaxed-btn');
    const sizeInput = document.getElementById('size');
    let mode = 'classic';
    let queens = [];

    function placeQueen(row, col) {
        const cells = document.querySelectorAll('.cell');
        const cell = Array.from(cells).find(c => 
            c.dataset.row == row && c.dataset.col == col
        );
        
        if (cell.classList.contains('queen')) {
            cell.classList.remove('queen');
            queens = queens.filter(q => !(q.row === row && q.col === col));
        } else {
            cell.classList.add('queen');
            queens.push({ row, col });
        }
    }

    // ... (resto del código de createBoard mostrado arriba)

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
    createBoard();
});
