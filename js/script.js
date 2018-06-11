const tileSize = 100;

function createBoard(size) {
    let tiles = createTiles(size);
    let distanceFromTop = 0;
    let distanceFromLeft = 0;
    let col, row;

    $('#main').empty();

    $('#main').css('height', (tileSize * size) + "px");
    $('#main').css('width', (tileSize * size) + "px");

    for(row = 0; row < size; row ++) {
        for (col = 0; col< size; col++) {
            let tileNumber = size * row + col;
            $('#main').append(
            "<div class=\"tile\" id=" + tileNumber +"> " + tiles[row][col].text + "</div>"
        );
            $('#' + tileNumber).css('top', distanceFromTop + "px");
            $('#' + tileNumber).css('left', distanceFromLeft + "px");
            $('#' + tileNumber).css('height', tileSize + "px");
            $('#' + tileNumber).css('width', tileSize + "px");
            if(tiles[row][col].isEmpty) {
                $('#' + tileNumber).css('background-color', 'red');
            }

            distanceFromLeft += tileSize;
        }
        distanceFromLeft = 0;
        distanceFromTop += tileSize;
    }

}

function createTiles(boardSize) {
    let tilesArray = [];
    for (let row = 0; row< boardSize; row++){
        tilesArray[row] = [];
        for (let col = 0; col < boardSize; col++){
            tilesArray[row][col] = new Tile(String.fromCharCode(65 + boardSize*row + col), false);
        }
    }
    tilesArray[boardSize-1][boardSize-1].isEmpty = true;
    return tilesArray;
}

function canGoDown(row, col) {

}