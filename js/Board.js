class Board {
    constructor(tileSize, boardSize) {
        this.tilesArray = createTiles(boardSize);
        this.boardSize = boardSize;
        this.tileSize = tileSize;
        this.emptyTilePosition = boardSize*boardSize -1;
    }
    canMove(tilePosition){

        if (tilePosition >= this.boardSize * this.boardSize || tilePosition < 0) return false;

        let tile = this.getTileByPosition(tilePosition);

        if (tile.row < this.boardSize - 1) { // si pas sur le bord du bas
            if ( this.tilesArray[tile.row+1][tile.column].isEmpty ) {
                return true;
            }
        }
        if (tile.row > 0) { // si pas sur le bord du haut
            if ( this.tilesArray[tile.row-1][tile.column].isEmpty ) {
                return true;
            }
        }
        if (tile.column < this.boardSize - 1) { // si pas sur le bord de droite
            if ( this.tilesArray[tile.row][tile.column+1].isEmpty ) {
                return true;
            }
        }
        if (tile.column > 0) { // si pas sur le bord du gauche
            if ( this.tilesArray[tile.row][tile.column-1].isEmpty ) {
                return true;
            }
        }

        return false;

    }
    getTileByPosition(tilePosition) {
        let row = Math.floor(tilePosition / this.boardSize);
        let col = tilePosition % this.boardSize;

        return this.tilesArray[row][col];
    }
    positionTile(tile) {
        this.tilesArray[tile.row][tile.column] = tile;
    }
    permute(firstTilePosition, secondTilePosition){
        let firstTile = this.getTileByPosition(firstTilePosition);
        let secondTile = this.getTileByPosition(secondTilePosition);
        let tempPosition = {row: firstTile.row, column: firstTile.column};
        let direction ="";

        firstTile.setPosition(secondTile.row, secondTile.column);
        secondTile.setPosition(tempPosition.row, tempPosition.column);

        this.positionTile(firstTile);
        this.positionTile(secondTile);

        if (firstTile.row === secondTile.row) {
            direction = (firstTile.column > secondTile.column)? 'toRight': 'toLeft';
        } else {
            direction = (firstTile.row > secondTile.row)? 'toBottom': 'toTop';
        }
        return {tileId: firstTile.id, direction: direction, newTilePosition: firstTile.row * this.boardSize + firstTile.column};

    }
    permuteWithEmptyTile(tilePosition) {
        let formerEmptyTilePosition = this.emptyTilePosition;
        this.emptyTilePosition = tilePosition;
        return this.permute(tilePosition, formerEmptyTilePosition);
    }
    moveEmptyTileOnce(){
        let tileToMove = {
            right : 0,
            top: 1,
            left : 2,
            bottom: 3
        }
        let tilePosition = +this.emptyTilePosition;
        let randomSide = Math.floor(4 * Math.random());
            switch (randomSide) {
                case tileToMove.right:
                    tilePosition += 1;
                    break;
                case tileToMove.top:
                    tilePosition -= +this.boardSize;
                    break;
                case tileToMove.left:
                    tilePosition -= 1;
                    break;
                case tileToMove.bottom:
                    tilePosition += +this.boardSize;
                    break;
            }
            if (this.canMove(tilePosition)){
                this.permuteWithEmptyTile(tilePosition);
            } else this.moveEmptyTileOnce();
        }
    moveEmptyTile(nTimes){
        nTimes = (nTimes >= 1000000)? 1000000: nTimes;
        for (let i = 0; i<nTimes; i++){
            this.moveEmptyTileOnce();
        }
    }

    checkWinCondition() {
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++){
                if (!this.tilesArray[row][col].isWellPlaced()) return false;
            }
        }
        return true;
    }

    evenParitySylvainStyle(){
        let parity = 0;
        // création du tableau des id
        let mockArray = [];

        for (let row =0; row< this.boardSize; row++){
            for (let col =0; col< this.boardSize; col++){
                mockArray[row*this.boardSize + col] = this.tilesArray[row][col].id;
            }
        }
        //Boucle de vérification
        for (let i = 0; i < mockArray.length; i++){
            //L'id est-il à la bonne place?
            while (mockArray[i] !== i){
                //Si non : permuter la valeur actuelle avec celle située à sa place dans le tableau
                let temp = mockArray[i];
                mockArray[i] = mockArray[mockArray[i]];
                mockArray[temp] = temp;
                parity++;
            }
        }

        return ((parity % 2) === 0);
    }

    emptyTileEvenParity(){
        let emptyTile = this.getTileByPosition(this.emptyTilePosition);
        let parity = (this.boardSize + emptyTile.row - 1) + (this.boardSize + emptyTile.column - 1);
        return (parity %2) === 0;
    }

    solvable(){
        return this.emptyTileEvenParity() === this.evenParitySylvainStyle();
    }

    getEmptyTile(){
        return this.getTileByPosition(this.emptyTilePosition);
    }

}

function createTiles(boardSize) {
    let tilesArray = [];
    for (let row = 0; row < boardSize; row++) {
        tilesArray[row] = [];
        for (let col = 0; col < boardSize; col++) {
            tilesArray[row][col] = new Tile(boardSize*row + col,String.fromCharCode(65 + boardSize * row + col), false, boardSize);
        }
    }

    tilesArray[boardSize - 1][boardSize - 1].text= '';
    tilesArray[boardSize - 1][boardSize - 1].isEmpty=true;
    return tilesArray;
}
