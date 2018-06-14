class Board {

    constructor(tileSize, boardSize) {
        this.tilesArray = this.createTiles(boardSize);
        this.boardSize = boardSize;
        this.tileSize = tileSize;
    }

    returnSelectedTile(tileDiv) {
        let tileId = +tileDiv.getAttribute('id');
        let selectedTile;

        for (let row = 0; row < this.boardSize; row++) {
            this.tilesArray[row].findIndex(function (element, index, array) {
                if (element.id === tileId) {
                    selectedTile = element;
                    return true;
                }
            });
        }
        return selectedTile;
    }

    returnEmptyTile() {
        let emptyTile;

        for (let row = 0; row < this.boardSize; row++) {
            this.tilesArray[row].findIndex(function (element, index, array) {
                if (element.isEmpty) {
                    emptyTile = element;
                    return true;
                }
            });
        }
        return emptyTile;
    }

    checkForEmptyTile(tileDiv) { // returns direction (U,D,L,R)
        let selectedTile = this.returnSelectedTile(tileDiv);
        let emptyTile;
        let direction;

        if (selectedTile.row > 0 && this.tilesArray[selectedTile.row - 1][selectedTile.col].isEmpty) {
            emptyTile = this.tilesArray[selectedTile.row - 1][selectedTile.col];
            direction = 'U';
        }
        if (selectedTile.col < (this.boardSize - 1) && this.tilesArray[selectedTile.row][selectedTile.col + 1].isEmpty) {
            emptyTile = this.tilesArray[selectedTile.row][selectedTile.col + 1];
            direction = 'R';
        }
        if (selectedTile.row < (this.boardSize - 1) && this.tilesArray[selectedTile.row + 1][selectedTile.col].isEmpty) {
            emptyTile = this.tilesArray[selectedTile.row + 1][selectedTile.col];
            direction = 'D';
        }
        if (selectedTile.col > 0 && this.tilesArray[selectedTile.row][selectedTile.col - 1].isEmpty) {
            emptyTile = this.tilesArray[selectedTile.row][selectedTile.col - 1];
            direction = 'L';
        }
        if (emptyTile) {
            this.switchTiles(selectedTile, emptyTile);
        }
        return direction;
    }

    switchTiles(selectedTile, emptyTile) {
        let selectedTileRow = selectedTile.row;
        let selectedTileCol = selectedTile.col;

        selectedTile.row = emptyTile.row;
        selectedTile.col = emptyTile.col;
        emptyTile.row = selectedTileRow;
        emptyTile.col = selectedTileCol;

        this.tilesArray[selectedTile.row][selectedTile.col] = selectedTile;
        this.tilesArray[emptyTile.row][emptyTile.col] = emptyTile;
    }

    createTiles(boardSize) {
        let tilesArray = [];
        for (let row = 0; row < boardSize; row++) {
            tilesArray[row] = [];
            for (let col = 0; col < boardSize; col++) {
                let tileId = (row * boardSize) + col;
                tilesArray[row][col] = new Tile(tileId, String.fromCharCode(65 + boardSize * row + col), false, boardSize);
            }
        }
        tilesArray[boardSize - 1][boardSize - 1].isEmpty = true;
        return tilesArray;
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    flipACoin(){ // Returns 1 or (-1)
        return Math.pow((-1),this.getRandomInt(2));
    }

    checkIfSwitchable(tile, rowIncr, colIncr){
        if ((tile.row + rowIncr) >= 0 && (tile.row + rowIncr) <= (this.boardSize - 1)) {
            if ((tile.col + colIncr) >= 0 && (tile.col + colIncr) <= (this.boardSize - 1)) {
                return true
            }
        }
        return false;
    }

    shuffle(numberOfLoops) {
        let emptyTile, selectedTile;
        let possibleAxis = {moveX : -1, moveY : 1};

        let randomDirection;
        let i = 0;

        while( i < numberOfLoops ){
            let randomAxis  = this.flipACoin();
            emptyTile = this.returnEmptyTile();
            switch(randomAxis){
                case (possibleAxis.moveX):
                    randomDirection = this.flipACoin();
                    if(this.checkIfSwitchable(emptyTile, 0, randomDirection)){
                        selectedTile = this.tilesArray[emptyTile.row][emptyTile.col + randomDirection];
                        this.switchTiles(selectedTile, emptyTile);
                        i++;
                    }
                    break;

                    case (possibleAxis.moveY):
                    randomDirection = this.flipACoin();
                    if(this.checkIfSwitchable(emptyTile, randomDirection, 0)){
                        selectedTile = this.tilesArray[emptyTile.row + randomDirection][emptyTile.col];
                        this.switchTiles(selectedTile, emptyTile);
                        i++;
                    }
                    break;
            }
        }
    }

    win(){
        for(let row = 0 ; row < this.boardSize ; row++){
            for (let col = 0 ; col < this.boardSize ; col++){
                if(!this.tilesArray[row][col].isWellPlaced()){
                    return false;
                }
            }
        }
        return true;
    }
}



