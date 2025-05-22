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

// Objeto con todas las soluciones conocidas (ampliable)
const allSolutions = {
    4: [
        [[0,1],[1,3],[2,0],[3,2]], // Solución 1
        [[0,2],[1,0],[2,3],[3,1]]  // Solución 2
    ],
    5: [
        [[0,0],[1,2],[2,4],[3,1],[4,3]],
        [[0,0],[1,3],[2,1],[3,4],[4,2]],
        [[0,1],[1,3],[2,0],[3,2],[4,4]]
    ],
    // Añadir más soluciones para otros tamaños
};

// Función para normalizar soluciones (ordenar por fila)
function normalizeSolution(queens) {
    return queens.map(q => [q.row, q.col])
                 .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

// Función para verificar solución
function checkSolution() {
    if (queens.length !== targetQueens) return false;

    const currentSolution = normalizeSolution(queens);
    const solutionKey = JSON.stringify(currentSolution);
    
    // Verificar si es solución válida y nueva
    const isValid = allSolutions[currentSize]?.some(sol => {
        return JSON.stringify(sol) === solutionKey;
    });

    if (isValid) {
        const wasNewSolution = registerSolution(solutionKey);
        if (wasNewSolution) {
            updateProgressDisplay();
            showSuccessMessage();
            return true;
        }
    }
    return false;
}

// Registrar solución (devuelve true si era nueva)
function registerSolution(solutionKey) {
    if (!foundSolutions.includes(solutionKey)) {
        foundSolutions.push(solutionKey);
        localStorage.setItem(`solutions-${currentSize}`, JSON.stringify(foundSolutions));
        return true;
    }
    return false;
}

// Actualizar la visualización del progreso
function updateProgressDisplay() {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const solutionsList = document.getElementById('solutions-list');
    
    totalSolutions = allSolutions[currentSize]?.length || 0;
    const percentage = totalSolutions > 0 ? 
        Math.min(100, (foundSolutions.length / totalSolutions) * 100) : 0;
    
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${foundSolutions.length}/${totalSolutions} soluciones`;
    
    // Actualizar lista
    solutionsList.innerHTML = foundSolutions.map((sol, i) => {
        const positions = JSON.parse(sol).map(pos => 
            `${String.fromCharCode(65+pos[1])}${pos[0]+1}`).join(', ');
        return `<li>Solución ${i+1}: ${positions}</li>`;
    }).join('');
    
    // Comprobar nivel completado
    if (foundSolutions.length === totalSolutions && totalSolutions > 0) {
        document.querySelector('.progress-section').classList.add('level-complete');
        showMessage(`¡NIVEL ${currentSize}x${currentSize} COMPLETADO!`, false);
    }
}

// Mostrar mensaje de éxito
function showSuccessMessage() {
    const remaining = totalSolutions - foundSolutions.length;
    const message = remaining > 0 ?
        `¡Solución correcta! (Faltan ${remaining} más)` :
        `¡Todas las soluciones encontradas!`;
    showMessage(message, false);
}

// Al iniciar el juego, cargar soluciones guardadas
function loadSavedSolutions() {
    const saved = localStorage.getItem(`solutions-${currentSize}`);
    foundSolutions = saved ? JSON.parse(saved) : [];
    updateProgressDisplay();
}

// Modificar createBoard para incluir carga inicial
function createBoard() {
    loadSavedSolutions();
    // ... resto del código existente ...
}

const allSolutions = {
    4: [
        [[0,1],[1,3],[2,0],[3,2]], // Solución 1: A2, B4, C1, D3
        [[0,2],[1,0],[2,3],[3,1]]  // Solución 2: A3, B1, C4, D2
    ],
    5: [
        [[0,0],[1,2],[2,4],[3,1],[4,3]], // A1, B3, C5, D2, E4
        [[0,0],[1,3],[2,1],[3,4],[4,2]], // A1, B4, C2, D5, E3
        [[0,1],[1,3],[2,0],[3,2],[4,4]], // A2, B4, C1, D3, E5
        [[0,1],[1,4],[2,2],[3,0],[4,3]], // A2, B5, C3, D1, E4
        [[0,2],[1,0],[2,3],[3,1],[4,4]], // A3, B1, C4, D2, E5
        [[0,2],[1,4],[2,1],[3,3],[4,0]], // A3, B5, C2, D4, E1
        [[0,3],[1,0],[2,2],[3,4],[4,1]], // A4, B1, C3, D5, E2
        [[0,3],[1,1],[2,4],[3,2],[4,0]], // A4, B2, C5, D3, E1
        [[0,4],[1,1],[2,3],[3,0],[4,2]], // A5, B2, C4, D1, E3
        [[0,4],[1,2],[2,0],[3,3],[4,1]]  // A5, B3, C1, D4, E2
    ],
    6: [
        [[0,1],[1,3],[2,5],[3,0],[4,2],[5,4]], // A2, B4, C6, D1, E3, F5
        [[0,2],[1,5],[2,1],[3,4],[4,0],[5,3]], // A3, B6, C2, D5, E1, F4
        [[0,3],[1,0],[2,4],[3,1],[4,5],[5,2]], // A4, B1, C5, D2, E6, F3
        [[0,4],[1,2],[2,0],[3,5],[4,3],[5,1]]  // A5, B3, C1, D6, E4, F2
    ],
    7: [
        [[0,0],[1,2],[1,4],[3,6],[4,1],[5,3],[6,5]], // A1, B3, C5, D7, E2, F4, G6
        [[0,0],[1,3],[2,6],[3,2],[4,5],[5,1],[6,4]], // A1, B4, C7, D3, E6, F2, G5
        [[0,0],[1,4],[2,1],[3,5],[4,2],[5,6],[6,3]], // A1, B5, C2, D6, E3, G7, F4
        // 36 soluciones más para 7x7...
    ],
    8: [
        [[0,0],[1,4],[2,7],[3,5],[4,2],[5,6],[6,1],[7,3]], // A1, B5, C8, D6, E3, F7, G2, H4
        [[0,0],[1,5],[2,7],[3,2],[4,6],[5,3],[6,1],[7,4]], // A1, B6, C8, D3, F7, G4, H2, I5
        // 90 soluciones más para 8x8...
    ]
    // Puedes añadir más tamaños según sea necesario
};

// Función para generar soluciones únicas (rotaciones y reflejos)
function generateAllUniqueSolutions(size) {
    // Implementación de un generador de soluciones únicas
    // (omitido por brevedad, pero puede usarse para ampliar)
}

// Al inicio del juego (en createBoard)
function createBoard() {
    // Cargar soluciones guardadas
    const saved = localStorage.getItem(`queens-${currentSize}-solutions`);
    foundSolutions = saved ? JSON.parse(saved) : [];
    
    // Inicializar contador
    totalSolutions = allSolutions[currentSize]?.length || 0;
    
    updateProgressDisplay();
    // ... resto del código ...
}

// Función mejorada para registrar soluciones
function registerSolution(solution) {
    const normalized = normalizeSolution(solution);
    const solutionKey = JSON.stringify(normalized);
    
    // Verificar si es nueva
    if (!foundSolutions.some(s => JSON.stringify(s) === solutionKey)) {
        foundSolutions.push(normalized);
        localStorage.setItem(
            `queens-${currentSize}-solutions`,
            JSON.stringify(foundSolutions)
        );
        return true;
    }
    return false;
}

function updateProgressDisplay() {
    const progressCount = document.getElementById('progress-count');
    const solutionsGrid = document.getElementById('solutions-grid');
    
    // Actualizar contador
    progressCount.textContent = `${foundSolutions.length}/${totalSolutions}`;
    
    // Generar mini-tableros para cada solución
    solutionsGrid.innerHTML = foundSolutions.map((sol, idx) => {
        let boardHTML = `<div class="solution-mini-board" style="--size: ${currentSize}">`;
        
        // Crear mini-tablero
        for (let row = 0; row < currentSize; row++) {
            for (let col = 0; col < currentSize; col++) {
                const hasQueen = sol.some(q => q[0] === row && q[1] === col);
                boardHTML += `<div class="mini-cell ${hasQueen ? 'queen' : ''}"></div>`;
            }
        }
        
        return `${boardHTML}</div><small>Solución ${idx+1}</small>`;
    }).join('');
    
    // Comprobar si se completó
    if (foundSolutions.length === totalSolutions && totalSolutions > 0) {
        document.querySelector('.solutions-container').classList.add('completed');
        showMessage(`¡Nivel ${currentSize}x${currentSize} dominado!`, false);
    }
}
