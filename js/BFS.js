let BFSgoal = [];
let depth = 0;

function BFS(e, maxDepth){
    let solutionFound = false;
    let solution = [];
    let emptyPos = findEmpty(e);
    let frontier = possibleMoves(e, emptyPos);

    if (hasWon(e)){}

    while (frontier.length > 0 && depth < maxDepth) {
        let next = [];
        frontier.forEach(state => {
            if (hasWon(state)) {
                solutionFound = true;
                solution = copy(state.path);
                return true;
            }
            let newEmptyPos = findEmpty(state);
            possibleMoves(state, newEmptyPos).forEach(move => next.unshift(move));
        });
        if (solutionFound){
            return solution;
        }
        frontier = next;
        depth++;
    }
    return 'not found';

}

function possibleMoves(state, emptyPosition){
    let frontier = [];
    let up = Up(state, emptyPosition), down = Down(state, emptyPosition), left = Left(state, emptyPosition),right = Right(state, emptyPosition);
    if (up){
        frontier.push(up);
    }
    if (down) {
        frontier.push(down);
    }
    if (left) {
        frontier.push(left);
    }
    if (right) {
        frontier.push(right);
    }
    return frontier;
}

function Up(state, emptyPosition){
    if (emptyPosition.row <= 0) return null;

    let newState = {grid:copyArray(state.grid), path: copy(state.path)};

    newState.grid[emptyPosition.row][emptyPosition.col] = newState.grid[emptyPosition.row - 1][emptyPosition.col];
    newState.grid[emptyPosition.row - 1][emptyPosition.col] = null;
    newState.path.push('U');

    return newState;
}
function Down(state, emptyPosition){
    if (emptyPosition.row === state.grid.length - 1) return null;

    let newState = {grid:copyArray(state.grid), path: copy(state.path)};

    newState.grid[emptyPosition.row][emptyPosition.col] = newState.grid[emptyPosition.row + 1][emptyPosition.col];
    newState.grid[emptyPosition.row + 1][emptyPosition.col] = null;
    newState.path.push('D');
    return newState;
}
function Left(state, emptyPosition){
    if (emptyPosition.col <= 0) return null;

    let newState = {grid:copyArray(state.grid), path: copy(state.path)};

    newState.grid[emptyPosition.row][emptyPosition.col] = newState.grid[emptyPosition.row][emptyPosition.col - 1];
    newState.grid[emptyPosition.row][emptyPosition.col - 1] = null;
    newState.path.push('L');
    return newState;
}
function Right(state, emptyPosition){
    if (emptyPosition.col === state.grid[emptyPosition.row].length - 1) return null;

    let newState = {grid:copyArray(state.grid), path: copy(state.path)};

    newState.grid[emptyPosition.row][emptyPosition.col] = newState.grid[emptyPosition.row][emptyPosition.col + 1];
    newState.grid[emptyPosition.row][emptyPosition.col + 1] = null;
    newState.path.push('R');
    return newState;
}

function copyArray(array2d){
    let newArray = [];
    for (let row = 0; row < array2d.length; row++){
        newArray[row] = [];
        for (let col = 0; col < array2d[row].length; col++){
            newArray[row][col] = array2d[row][col];
        }
    }
    return newArray;
}

function hasWon(state){
    for (let row = 0; row < state.grid.length; row++){
        for (let col = 0; col < state.grid[row].length; col++){
            if (state.grid[row][col] !== BFSgoal[row][col]) return false;
        }
    }
    return true;
}

function findEmpty(state){
    for (let row = 0; row < state.grid.length; row++){
        for(let col = 0; col < state.grid[row].length; col++){
            if (state.grid[row][col] === null) {
                return {row:row, col:col};
            }
        }
    }
}

function copy(array){
    let result = [];
    array.forEach(element => result.push(element));
    return result;
}

function BFSinitGoalReturnState(board){
    let grid = [];
    let emptyId = board.boardSize * board.boardSize - 1;
    // Création de la grid de recherche de solution et de la grid résolue
    for (let i = 0; i<board.boardSize; i++){
        grid[i] = [];
        BFSgoal[i] = [];
        for (let j = 0; j <board.boardSize; j++){
            grid[i][j] = (board.tilesArray[i][j].id !== emptyId )? board.tilesArray[i][j].id: null;
            BFSgoal[i][j] = i * board.boardSize + j;
        }
    }
    BFSgoal[board.boardSize -1][board.boardSize -1] = null;
    return {grid: grid, path: []};
}