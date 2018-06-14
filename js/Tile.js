class Tile {
    constructor(id, text, isEmpty, boardSize) {
        this.id = id;
        this.text = text;
        this.isEmpty = isEmpty;
        this.column = id % boardSize;
        this.row = Math.floor(id / boardSize);
        this.boardSize = boardSize;
    }

    setPosition(row, col) {
        this.row = row;
        this.column = col;
    }

    isWellPlaced(){
        return (this.row * this.boardSize + this.column === +this.id);
    }
}