class Board {
    constructor(tileSize, boardSize) {
        this.tilesArray = createTiles(boardSize);
        let distanceFromTop = 0;
        let distanceFromLeft = 0;
        let col, row;

        $('#main').empty().css({
            'height': (tileSize * boardSize) + "px",
            'width': (tileSize * boardSize) + "px"
        });

        for (row = 0; row < boardSize; row++) {
            for (col = 0; col < boardSize; col++) {
                let tileNumber = boardSize * row + col;
                $('#main').append(
                    "<div class=\"tile\" id=" + tileNumber + "> " + this.tilesArray[row][col].text + "</div>"
                );
                $('#' + tileNumber).css({
                    'top': distanceFromTop + "px",
                    'left': distanceFromLeft + "px",
                    'height': tileSize + "px",
                    'width': tileSize + "px"
                });
            if(this.tilesArray[row][col].isEmpty){
                $('#' + tileNumber).css('background-color','red');
            }
                distanceFromLeft += tileSize;
            }
            distanceFromLeft = 0;
            distanceFromTop += tileSize;
        }
    }
}

function createTiles(boardSize) {
    let tilesArray = [];
    for (let row = 0; row < boardSize; row++) {
        tilesArray[row] = [];
        for (let col = 0; col < boardSize; col++) {
            tilesArray[row][col] = new Tile(String.fromCharCode(65 + boardSize * row + col), false);
        }
    }
    tilesArray[boardSize - 1][boardSize - 1].isEmpty = true;
    return tilesArray;
}