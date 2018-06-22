const MAX_DEPTH = 100;
let boardSize;
let grid = [], goal = [];
let bestDepth = MAX_DEPTH;
let bestMoves = [];
let moves = [];
let emptyTileValue;

function initGrids(board){
    // Création de la grid de recherche de solution et de la grid résolue
    for (let i = 0; i<board.boardSize; i++){
        grid[i] = [];
        goal[i] = [];
        for (let j = 0; j <board.boardSize; j++){
            grid[i][j] = board.tilesArray[i][j].id;
            goal[i][j] = i * board.boardSize + j;
        }
    }
    emptyTileValue = board.boardSize * board.boardSize -1;
    boardSize = board.boardSize;
}

function searchDfs(emptyX, emptyY, depth, playedX, playedY, previousMove) {
    if (depth > bestDepth) {
        return false;
    }
    if (depth !== 0) moves[depth - 1] = String.fromCharCode(65 + grid[playedY][playedX]);
    if (isCorrect()){
        bestDepth = depth;
        bestMoves = [];
        for (let i =0; i< depth; i++){
            bestMoves[i] = moves[i];
    }
        // return true;
    }

    let possibleMoves = getPossibleMoves(emptyX,emptyY,boardSize, previousMove);
    let newEmptyX = emptyX, newEmptyY = emptyY;

    for (let i=0; i<possibleMoves.length; i++){
        let move = possibleMoves[i];
        switch(move){
            case "LeftTile":
                grid[emptyY][emptyX] = grid[emptyY][emptyX - 1];
                grid[emptyY][emptyX - 1] = emptyTileValue; //id de la last tile, la vide (pas clair j'avoue)
                newEmptyX--;
                break;
            case "RightTile":
                grid[emptyY][emptyX] = grid[emptyY][emptyX + 1];
                grid[emptyY][emptyX + 1] = emptyTileValue; //id de la last tile, la vide (pas clair j'avoue)
                newEmptyX++;
                break;
            case "TopTile":
                grid[emptyY][emptyX] = grid[emptyY - 1][emptyX];
                grid[emptyY - 1][emptyX] = emptyTileValue; //id de la last tile, la vide (pas clair j'avoue)
                newEmptyY--;
                break;
            case "BottomTile":
                grid[emptyY][emptyX] = grid[emptyY + 1][emptyX];
                grid[emptyY + 1][emptyX] = emptyTileValue; //id de la last tile, la vide (pas clair j'avoue)
                newEmptyY++;
                break;
        }
        previousMove = move;
        searchDfs(newEmptyX, newEmptyY, depth + 1, emptyX, emptyY, previousMove);
        switch(move){ // on remonte l'arbre
            case "LeftTile":
                grid[emptyY][emptyX - 1] = grid[emptyY][emptyX];
                grid[emptyY][emptyX] = emptyTileValue;
                newEmptyX++;
                break;
            case "RightTile":
                grid[emptyY][emptyX + 1] = grid[emptyY][emptyX];
                grid[emptyY][emptyX] = emptyTileValue;
                newEmptyX--;
                break;
            case "TopTile":
                grid[emptyY - 1][emptyX] = grid[emptyY][emptyX];
                grid[emptyY ][emptyX] = emptyTileValue;
                newEmptyY++;
                break;
            case "BottomTile":
                grid[emptyY + 1][emptyX] = grid[emptyY][emptyX];
                grid[emptyY][emptyX] = emptyTileValue;
                newEmptyY--;
                break;
        }
    }
    return false;
}

function getPossibleMoves(emptyX, emptyY, boardSize, previousMove){
    let moves = [];
    if (emptyX >= 0 && emptyX < boardSize -1 && previousMove !== "LeftTile"){
        moves.push("RightTile");
    }
    if (emptyX > 0 && emptyX < boardSize && previousMove !== "RightTile") {
        moves.push("LeftTile");
    }
    if (emptyY >= 0 && emptyY < boardSize -1 && previousMove !== "TopTile"){
        moves.push("BottomTile");
    }
    if (emptyY > 0 && emptyY < boardSize && previousMove !== "BottomTile") {
        moves.push("TopTile");
    }
    return moves;
}

function isCorrect(){
    for (let i = 0; i<board.boardSize; i++){
        for (let j = 0; j <board.boardSize; j++){
            if (grid[i][j] !== goal[i][j]) return false;
        }
    }
    return true;
}

function searchSolution(board, maxDepth) {
    initGrids(board);
    bestDepth = maxDepth;
    moves = [];
    bestMoves = [];
    let emptyTile = board.getEmptyTile();
    searchDfs(emptyTile.column, emptyTile.row, 0, -1, -1, '');
    if (bestMoves.length){
        return bestMoves;
    } else return 'not found';
}

