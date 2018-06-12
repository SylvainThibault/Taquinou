class Board {
    constructor(tileSize, boardSize) {
        this.tilesArray = createTiles(boardSize);
        this.boardSize = boardSize;
        this.tileSize = tileSize;

    }
    canMove(tileId){

        let tileIndexes = this.findTileIndexes(tileId);


        if (tileIndexes.colIndex === -1) {
            return false;
        }

        if (tileIndexes.rowIndex < this.boardSize - 1) { // si pas sur le bord du bas
            if ( this.tilesArray[tileIndexes.rowIndex+1][tileIndexes.colIndex].isEmpty ) {
                return true;
            }
        }
        if (tileIndexes.rowIndex > 0) { // si pas sur le bord du haut
            if ( this.tilesArray[tileIndexes.rowIndex-1][tileIndexes.colIndex].isEmpty ) {
                return true;
            }
        }
        if (tileIndexes.colIndex < this.boardSize - 1) { // si pas sur le bord de droite
            if ( this.tilesArray[tileIndexes.rowIndex][tileIndexes.colIndex+1].isEmpty ) {
                return true;
            }
        }
        if (tileIndexes.colIndex > 0) { // si pas sur le bord du gauche
            if ( this.tilesArray[tileIndexes.rowIndex][tileIndexes.colIndex-1].isEmpty ) {
                return true;
            }
        }

        return false;

    }

    findTileIndexes(tileId) {
        tileId = +tileId;
        let rowIndex, colIndex;

        for (let row = 0; row < this.boardSize; row++){
            colIndex = this.tilesArray[row].findIndex((tile) => {
                return tile.id == tileId;
            });
            if (colIndex != -1) {
                rowIndex = row;
                break;
            }
        }
        return {rowIndex: rowIndex, colIndex: colIndex};
    }

    permute(firstTileId, secondTileId){
        let firstTileIndex = this.findTileIndexes(firstTileId);
        let secondTileIndex = this.findTileIndexes(secondTileId);
        let temp = this.tilesArray[firstTileIndex.rowIndex][firstTileIndex.colIndex];
        this.tilesArray[firstTileIndex.rowIndex][firstTileIndex.colIndex] = this.tilesArray[secondTileIndex.rowIndex][secondTileIndex.colIndex];
        this.tilesArray[secondTileIndex.rowIndex][secondTileIndex.colIndex] = temp;

        if (firstTileIndex.rowIndex === secondTileIndex.rowIndex) {
            if (firstTileIndex.colIndex < secondTileIndex.colIndex) {
                return 'toRight';
            } else return 'toLeft';
        }
        if (firstTileIndex.rowIndex < secondTileIndex.rowIndex) {
            return 'toBottom';
        }
        return 'toTop';

        }

}

function createTiles(boardSize) {
    let tilesArray = [];
    for (let row = 0; row < boardSize; row++) {
        tilesArray[row] = [];
        for (let col = 0; col < boardSize; col++) {
            tilesArray[row][col] = new Tile(boardSize*row + col,String.fromCharCode(65 + boardSize * row + col), false);
        }
    }

    tilesArray[boardSize - 1][boardSize - 1].text= '';
    tilesArray[boardSize - 1][boardSize - 1].isEmpty=true;
    return tilesArray;
}

