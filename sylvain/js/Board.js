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

    flipACoin() { // Returns 1 or (-1)
        return Math.pow((-1), this.getRandomInt(2));
    }

    checkIfSwitchable(tile, rowIncr, colIncr) {
        if ((tile.row + rowIncr) >= 0 && (tile.row + rowIncr) <= (this.boardSize - 1)) {
            if ((tile.col + colIncr) >= 0 && (tile.col + colIncr) <= (this.boardSize - 1)) {
                return true
            }
        }
        return false;
    }

    tileShuffle(numberOfLoops) {
        let emptyTile, selectedTile;
        let possibleAxis = {moveX: -1, moveY: 1};

        let randomDirection;
        let i = 0;

        while (i < numberOfLoops) {
            let randomAxis = this.flipACoin();
            emptyTile = this.returnEmptyTile();
            switch (randomAxis) {
                case (possibleAxis.moveX):
                    randomDirection = this.flipACoin();
                    if (this.checkIfSwitchable(emptyTile, 0, randomDirection)) {
                        selectedTile = this.tilesArray[emptyTile.row][emptyTile.col + randomDirection];
                        this.switchTiles(selectedTile, emptyTile);
                        i++;
                    }
                    break;

                case (possibleAxis.moveY):
                    randomDirection = this.flipACoin();
                    if (this.checkIfSwitchable(emptyTile, randomDirection, 0)) {
                        selectedTile = this.tilesArray[emptyTile.row + randomDirection][emptyTile.col];
                        this.switchTiles(selectedTile, emptyTile);
                        i++;
                    }
                    break;
            }
        }
    }

    win() {
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (!this.tilesArray[row][col].isWellPlaced()) {
                    return false;
                }
            }
        }
        return true;
    }

    checkEmptyTileParity() { // return true = pair ; false = impair
        let emptyTile = this.returnEmptyTile();

        let xPosition = +emptyTile.row;
        let yPosition = +emptyTile.col;

        return this.checkParity(xPosition + yPosition);
    }

    checkSolutionParityBibiStyle() { // return true = pair ; false = impair
        let indexArray = this.toArrayOfIndexes(this.tilesArray);
        let isArraySorted = false;
        let nbOfSwitches = 0;

        while (!isArraySorted) {
            isArraySorted = true;
            for (let i = 0; i < indexArray.length; i++) {
                let checkedValue = indexArray[i];
                let indexOfCheckedValue = indexArray.indexOf(checkedValue);
                if (checkedValue !== (indexOfCheckedValue)) {
                    let tmp = indexArray[checkedValue];
                    indexArray[checkedValue] = checkedValue;
                    indexArray[indexOfCheckedValue] = tmp;
                    isArraySorted = false;
                    nbOfSwitches++;
                }
            }
        }
        return this.checkParity(nbOfSwitches);
    }

    checkSolutionParityWithSelectionSort(){
        let indexArray = this.toArrayOfIndexes(this.tilesArray);
        let n = indexArray.length;
        let nbOfSwitches = 0;

        for(let i = 0 ; i < n - 1 ; i++){
            let min = i;
            for(let j = i + 1 ; j < n  ; j++){
                if( indexArray[j] < indexArray[min]){
                    min = j;
                }
            }
            if(min !== i){
                let tmp = indexArray[i];
                indexArray[i] = indexArray[min];
                indexArray[min] = tmp;
                nbOfSwitches++;
            }
        }
        return this.checkParity(nbOfSwitches);
    }

    toArrayOfIndexes(tilesArray) {
        let indexArray = [];
        let currentPosition;
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                currentPosition = (row * (this.boardSize) + col);
                indexArray[currentPosition] = tilesArray[row][col].id;
            }
        }
        return indexArray;
    }

    checkParity(int) {
        return (int % 2 === 0);
    }

    randomizeBoard() {
        let tmpArray = this.tilesArray;
        let flatArray = [].concat(...tmpArray);
        let shuffledArray = this.randomShuffle(flatArray);

        for(let row = 0 ; row < this.boardSize ; row++){
            for(let col = 0 ; col < this.boardSize ; col++){
                let index = (row * (this.boardSize) + col);
                this.tilesArray[row][col] = shuffledArray[index];
                this.tilesArray[row][col].row = row ;
                this.tilesArray[row][col].col = col ;
            }
        }
    }

    randomShuffle(array) {
        let j = 0;
        let valI = '';
        let valJ = valI;
        let l = array.length - 1;
        while (l > -1) {
            j = Math.floor(Math.random() * l);
            valI = array[l];
            valJ = array[j];
            array[l] = valJ;
            array[j] = valI;
            l = l - 1;
        }
        return array;
    }
}




