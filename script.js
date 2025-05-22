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

// Añade al inicio con las otras variables
const solutions = {
    4: [
        [[0,1],[1,3],[2,0],[3,2]],
        [[0,2],[1,0],[2,3],[3,1]]
    ],
    5: [
        [[0,0],[1,2],[2,4],[3,1],[4,3]],
        [[0,0],[1,3],[2,1],[3,4],[4,2]]
    ],
    // Añade más soluciones para otros tamaños
};
let foundSolutions = [];
let totalSolutions = 0;

// Función para verificar solución
function checkSolution() {
    if (queens.length !== targetQueens) return false;
    
    const currentSolution = queens.map(q => [q.row, q.col]).sort((a,b) => a[0] - b[0]);
    const solutionKey = JSON.stringify(currentSolution);
    
    // Verificar si es una solución válida
    const isValid = solutions[currentSize]?.some(sol => {
        return JSON.stringify(sol) === solutionKey;
    });
    
    if (isValid && !foundSolutions.includes(solutionKey)) {
        foundSolutions.push(solutionKey);
        totalSolutions = solutions[currentSize]?.length || 0;
        updateProgress();
        
        // Mostrar en la lista
        const solutionItem = document.createElement('li');
        solutionItem.textContent = `Solución ${foundSolutions.length}: ${queens.map(q => 
            `${String.fromCharCode(65+q.col)}${q.row+1}`).join(', ')}`;
        document.getElementById('solutions-list').appendChild(solutionItem);
        
        if (foundSolutions.length === totalSolutions && totalSolutions > 0) {
            showMessage(`¡NIVEL COMPLETADO! Encontraste todas las soluciones para ${currentSize}x${currentSize}`, false);
            document.querySelector('.progress-section').classList.add('level-complete');
        } else {
            showMessage(`¡Solución correcta! (${foundSolutions.length}/${totalSolutions})`, false);
        }
        return true;
    }
    return false;
}

// Función para actualizar progreso
function updateProgress() {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const percentage = totalSolutions > 0 ? (foundSolutions.length / totalSolutions) * 100 : 0;
    
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${foundSolutions.length}/${totalSolutions} soluciones encontradas`;
}

// Modifica la función placeQueen para llamar a checkSolution
function placeQueen(row, col) {
    // ... (código anterior)
    
    if (validateMove(row, col)) {
        cell.classList.add('queen');
        queens.push({ row, col });
        showMessage(`Reina colocada en ${String.fromCharCode(65+col)}${row+1} (${queens.length}/${targetQueens})`);
        
        if (queens.length === targetQueens) {
            if (!checkSolution()) {
                showMessage("Configuración completa pero no es una solución válida", true);
            }
        }
    }
}

// Modifica createBoard para resetear progreso
function createBoard() {
    foundSolutions = [];
    totalSolutions = solutions[currentSize]?.length || 0;
    updateProgress();
    document.getElementById('solutions-list').innerHTML = '';
    document.querySelector('.progress-section').classList.remove('level-complete');
    // ... (resto del código)
}
