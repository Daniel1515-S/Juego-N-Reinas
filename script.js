document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const message = document.getElementById('message');
    const resetBtn = document.getElementById('reset-btn');
    let queens = [];

    function createBoard() {
        board.innerHTML = '';
        queens = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', () => placeQueen(i, j));
                board.appendChild(cell);
            }
        }
    }

    function placeQueen(row, col) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell.classList.contains('queen')) {
            cell.classList.remove('queen');
            queens = queens.filter(q => q.row !== row || q.col !== col);
        } else {
            cell.classList.add('queen');
            queens.push({ row, col });
        }
    }

    resetBtn.addEventListener('click', createBoard);
    createBoard();
});