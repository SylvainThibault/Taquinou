class Tile {
    constructor(id, text, isEmpty, boardSize) {
        this.id = id;
        this.text = text;
        this.isEmpty = isEmpty;
        this.row = Math.floor(id/boardSize);
        this.col = id%boardSize;
        this.boardSize = boardSize;
    }

    isWellPlaced(){
        return ( this.row * this.boardSize + this.col === +this.id);
    }
}