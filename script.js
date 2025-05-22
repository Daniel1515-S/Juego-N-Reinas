document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const boardContainer = document.getElementById('board-container');
    const classicBtn = document.getElementById('classic-btn');
    const relaxedBtn = document.getElementById('relaxed-btn');
    const sizeInput = document.getElementById('size');
    const queensInput = document.getElementById('queens');
    const queensControl = document.getElementById('queens-control');
    const messageEl = document.getElementById('message');
    const progressFill = document.getElementById('progress-fill');
    const progressCount = document.getElementById('progress-count');
    const solutionsGrid = document.getElementById('solutions-grid');
    
    // Variables del juego
    let mode = 'classic';
    let queens = [];
    let currentSize = 4;
    let targetQueens = 4;
    let foundSolutions = [];
    let totalSolutions = 0;

    // Base de datos de soluciones conocidas
    const allSolutions = {
        4: [
            [[0,1],[1,3],[2,0],[3,2]], // A2, B4, C1, D3
            [[0,2],[1,0],[2,3],[3,1]]  // A3, B1, C4, D2
        ],
        5: [
            [[0,0],[1,2],[2,4],[3,1],[4,3]],
            [[0,0],[1,3],[2,1],[3,4],[4,2]],
            [[0,1],[1,3],[2,0],[3,2],[4,4]],
            [[0,1],[1,4],[2,2],[3,0],[4,3]],
            [[0,2],[1,0],[2,3],[3,1],[4,4]],
            [[0,2],[1,4],[2,1],[3,3],[4,0]],
            [[0,3],[1,0],[2,2],[3,4],[4,1]],
            [[0,3],[1,1],[2,4],[3,2],[4,0]],
            [[0,4],[1,1],[2,3],[3,0],[4,2]],
            [[0,4],[1,2],[2,0],[3,3],[4,1]]
        ],
        6: [
            [[0,1],[1,3],[2,5],[3,0],[4,2],[5,4]],
            [[0,2],[1,5],[2,1],[3,4],[4,0],[5,3]],
            [[0,3],[1,0],[2,4],[3,1],[4,5],[5,2]],
            [[0,4],[1,2],[2,0],[3,5],[4,3],[5,1]]
        ],
        7: [
            [[0,0],[1,2],[2,4],[3,6],[4,1],[5,3],[6,5]],
            [[0,0],[1,3],[2,6],[3,2],[4,5],[5,1],[6,4]],
            [[0,0],[1,4],[2,1],[3,5],[4,2],[5,6],[6,3]],
            // ... más soluciones para 7x7
        ],
        8: [
            [[0,0],[1,4],[2,7],[3,5],[4,2],[5,6],[6,1],[7,3]],
            [[0,0],[1,5],[2,7],[3,2],[4,6],[5,3],[6,1],[7,4]],
            // ... más soluciones para 8x8
        ]
    };

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
            targetQueens = Math.min(currentSize - 1, parseInt(queensInput.value));
            queensInput.min = 1;
            queensInput.max = currentSize;
            queensInput.value = targetQueens;
            queensControl.style.opacity = '1';
            queensInput.disabled = false;
        }
    }

    // Función para crear el tablero
    function createBoard() {
        updateControls();
        boardContainer.innerHTML = '';
        queens = [];
        
        // Cargar soluciones guardadas
        const saved = localStorage.getItem(`queens-${currentSize}-solutions`);
        foundSolutions = saved ? JSON.parse(saved) : [];
        totalSolutions = allSolutions[currentSize]?.length || 0;
        updateProgressDisplay();
        
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
        
        showMessage(`Modo ${mode}. Coloca ${targetQueens} reinas.`);
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
                    checkSolution();
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

    // Función para verificar solución
    function checkSolution() {
        const currentSolution = normalizeSolution(queens);
        const solutionKey = JSON.stringify(currentSolution);
        
        // Verificar si es solución válida y nueva
        const isValid = allSolutions[currentSize]?.some(sol => {
            return JSON.stringify(normalizeSolution(sol.map(([r,c]) => ({row:r,col:c})))) === solutionKey;
        });

        if (isValid && !foundSolutions.some(s => JSON.stringify(s) === solutionKey)) {
            foundSolutions.push(currentSolution);
            localStorage.setItem(`queens-${currentSize}-solutions`, JSON.stringify(foundSolutions));
            updateProgressDisplay();
            
            if (foundSolutions.length === totalSolutions && totalSolutions > 0) {
                showMessage(`¡NIVEL ${currentSize}x${currentSize} COMPLETADO!`, false);
                document.querySelector('.progress-section').classList.add('completed');
            } else {
                showMessage(`¡Solución correcta! (${foundSolutions.length}/${totalSolutions})`, false);
            }
        } else if (queens.length === targetQueens) {
            showMessage("Configuración completa pero no es una solución válida", true);
        }
    }

    // Normalizar solución (ordenar por fila)
    function normalizeSolution(queens) {
        return queens.map(q => [q.row, q.col])
                    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    }

    // Actualizar visualización del progreso
    function updateProgressDisplay() {
        totalSolutions = allSolutions[currentSize]?.length || 0;
        const percentage = totalSolutions > 0 ? 
            Math.min(100, (foundSolutions.length / totalSolutions) * 100) : 0;
        
        progressFill.style.width = `${percentage}%`;
        progressCount.textContent = `${foundSolutions.length}/${totalSolutions}`;
        
        // Mostrar mini-tableros de soluciones encontradas
        solutionsGrid.innerHTML = foundSolutions.map((sol, idx) => {
            let boardHTML = `<div class="solution-mini"><div class="solution-mini-board" style="--size: ${currentSize}">`;
            
            for (let row = 0; row < currentSize; row++) {
                for (let col = 0; col < currentSize; col++) {
                    const hasQueen = sol.some(([r,c]) => r === row && c === col);
                    boardHTML += `<div class="mini-cell ${hasQueen ? 'queen' : ''}"></div>`;
                }
            }
            
            return `${boardHTML}</div><p>Solución ${idx+1}</p></div>`;
        }).join('');
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
    createBoard();
});
