class Board {

    constructor(tileSize, boardSize) {
        this.maxDepth = 0;
        this.bestMoves = [];
        this.movesArray = [];
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

    checkForPossibleDirections(tile) { // Looks for empty tiles & returns possible direction
        let emptyTile;
        let direction;

        if (tile.row > 0 && this.tilesArray[tile.row - 1][tile.col].isEmpty) {
            emptyTile = this.tilesArray[tile.row - 1][tile.col];
            direction = 'U';
        }
        if (tile.col < (this.boardSize - 1) && this.tilesArray[tile.row][tile.col + 1].isEmpty) {
            emptyTile = this.tilesArray[tile.row][tile.col + 1];
            direction = 'R';
        }
        if (tile.row < (this.boardSize - 1) && this.tilesArray[tile.row + 1][tile.col].isEmpty) {
            emptyTile = this.tilesArray[tile.row + 1][tile.col];
            direction = 'D';
        }
        if (tile.col > 0 && this.tilesArray[tile.row][tile.col - 1].isEmpty) {
            emptyTile = this.tilesArray[tile.row][tile.col - 1];
            direction = 'L';
        }
        if (emptyTile) {
            this.switchTiles(tile, emptyTile);
        }
        return direction;
    }

    checkIfSwitchable(tile, rowIncr, colIncr) {
        if ((tile.row + rowIncr) >= 0 && (tile.row + rowIncr) <= (this.boardSize - 1)) {
            if ((tile.col + colIncr) >= 0 && (tile.col + colIncr) <= (this.boardSize - 1)) {
                return true
            }
        }
        return false;
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

    checkSolutionParityWithSelectionSort() {
        let indexArray = this.toArrayOfIndexes(this.tilesArray);
        let n = indexArray.length;
        let nbOfSwitches = 0;

        for (let i = 0; i < n - 1; i++) {
            let min = i;
            for (let j = i + 1; j < n; j++) {
                if (indexArray[j] < indexArray[min]) {
                    min = j;
                }
            }
            if (min !== i) {
                let tmp = indexArray[i];
                indexArray[i] = indexArray[min];
                indexArray[min] = tmp;
                nbOfSwitches++;
            }
        }
        return this.checkParity(nbOfSwitches);
    }

    checkParity(int) {
        return (int % 2 === 0);
    }

    randomizeBoard() {
        let tmpArray = this.tilesArray;
        let flatArray = [].concat(...tmpArray);
        let shuffledArray = this.randomShuffle(flatArray);

        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                let index = (row * (this.boardSize) + col);
                this.tilesArray[row][col] = shuffledArray[index];
                this.tilesArray[row][col].row = row;
                this.tilesArray[row][col].col = col;
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

    toDoubleArrayOfIndexes(tilesArray) {
        let doubleIndexArray = [];
        for (let row = 0; row < this.boardSize; row++) {
            doubleIndexArray[row] = [];
            for (let col = 0; col < this.boardSize; col++) {
                doubleIndexArray[row][col] = tilesArray[row][col].id;
                if (tilesArray[row][col].isEmpty) {
                    doubleIndexArray[row][col] = null;
                }
            }
        }
        return doubleIndexArray;
    }

    returnOrigin(state) {
        let originX, originY;
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (state[row][col] === null) {
                    originY = row;
                    originX = col;
                    break;
                }
            }
        }
        return {row: originY, col: originX};
    }

    startDfs(state, depth) {
        this.movesArray = [];
        this.maxDepth = 10;
        return this.depthFirstSearch(state, depth);
    }

    depthFirstSearch(state, depth) {
        let lastMove = this.movesArray[this.movesArray.length - 1];

        if (depth > this.maxDepth) {
            return false;
        }

        if (this.dfsWin(state)) {
            this.bestMoves = [];
            for (let i = 0; i < this.movesArray.length; i++) {
                this.bestMoves[i] = this.movesArray[i];
            }
            this.maxDepth = depth;
        }

        let up = this.up(state);
        if (up && lastMove !== 'D') {
            this.movesArray.push('U');
            this.depthFirstSearch(up, depth + 1);
            this.movesArray.pop();
        }

        let left = this.left(state);
        if (left && lastMove !== 'R') {
            this.movesArray.push('L');
            this.depthFirstSearch(left, depth + 1);
            this.movesArray.pop();
        }

        let down = this.down(state);
        if (down && lastMove !== 'U') {
            this.movesArray.push('D');
            this.depthFirstSearch(down, depth + 1);
            this.movesArray.pop();
        }

        let right = this.right(state);
        if (right && lastMove !== 'L') {
            this.movesArray.push('R');
            this.depthFirstSearch(right, depth + 1);
            this.movesArray.pop();
        }
    }

    up(state) {
        let xUp, yUp, newState;

        newState = this.copyState(state);

        let emptyX = this.returnOrigin(newState).col;
        let emptyY = this.returnOrigin(newState).row;

        xUp = emptyX;
        yUp = emptyY - 1;

        if ((yUp >= 0) && (yUp < this.boardSize)) {
            newState[emptyY][emptyX] = newState[yUp][xUp];
            newState[yUp][xUp] = null;
            return newState;
        }
        return null;
    }

    down(state) {
        let xUp, yUp, newState;

        newState = this.copyState(state);

        let emptyX = this.returnOrigin(newState).col;
        let emptyY = this.returnOrigin(newState).row;

        xUp = emptyX;
        yUp = emptyY + 1;

        if ((yUp >= 0) && (yUp < this.boardSize)) {
            newState[emptyY][emptyX] = newState[yUp][xUp];
            newState[yUp][xUp] = null;
            return newState;
        }
        return null;
    }

    left(state) {
        let xUp, yUp, newState;

        newState = this.copyState(state);

        let emptyX = this.returnOrigin(newState).col;
        let emptyY = this.returnOrigin(newState).row;

        xUp = emptyX - 1;
        yUp = emptyY;

        if ((xUp >= 0) && (yUp >= 0) && (xUp < this.boardSize) && (yUp < this.boardSize)) {
            newState[emptyY][emptyX] = newState[yUp][xUp];
            newState[yUp][xUp] = null;
            return newState;
        }

        return null;
    }

    right(state) {
        let xUp, yUp, newState;

        newState = this.copyState(state);

        let emptyX = this.returnOrigin(newState).col;
        let emptyY = this.returnOrigin(newState).row;

        xUp = emptyX + 1;
        yUp = emptyY;

        if ((xUp >= 0) && (yUp >= 0) && (xUp < this.boardSize) && (yUp < this.boardSize)) {
            newState[emptyY][emptyX] = newState[yUp][xUp];
            newState[yUp][xUp] = null;
            return newState;
        }

        return null;
    }

    copyState(state) {
        let newState = [];
        for (let row = 0; row < this.boardSize; row++) {
            newState[row] = [];
            for (let col = 0; col < this.boardSize; col++) {
                newState[row][col] = state[row][col];
            }
        }
        return newState;
    }

    dfsWin(state) {
        let sortedArray = this.initGoal();
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (state[row][col] !== sortedArray[row][col]) {
                    return false;
                }
            }
        }
        return true;
    }

    initGoal() {
        let goal = [];
        for (let i = 0; i < this.boardSize; i++) {
            goal[i] = [];
            for (let j = 0; j < this.boardSize; j++) {
                goal[i][j] = i * this.boardSize + j;
            }
        }
        goal[this.boardSize - 1][this.boardSize - 1] = null;
        return goal;
    }

    breadthFirstSearch(state) {
        let frontiere = [{depth: 0, state: state}];

        // if (this.dfsWin(state)) {
        //     return true;
        // }

        let newStartIndex = 0;

        for ( let i = newStartIndex ; i < frontiere.length ; i++ ) {
            newStartIndex = ;
            let depth = i + 1;

            let up = this.up(frontiere[i].state);
            if (up) {
                frontiere.push({depth: depth, state: up});
                newStartIndex++;
            }

            let left = this.left(frontiere[i].state);
            if (left) {
                frontiere.push({depth: depth, state: left});
                newStartIndex++;

            }

            let down = this.down(frontiere[i].state);
            if (down) {
                frontiere.push({depth: depth, state: down});
                newStartIndex++;
            }

            let right = this.right(frontiere[i].state);
            if (right) {
                frontiere.push({depth: depth, state: right});
                newStartIndex++;
            }

            // for ( let j = 0 ; j < frontiere.length ; j++ ) {
            //     console.log(frontiere);
            //     if (frontiere[j].depth === i){
            //         frontiere[j] = null;
            //     }
            // }

            if (i > 0) {
                return frontiere;
            }
        }
    }


}




