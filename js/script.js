
let tiles = [new Tile('a'),
    new Tile('b'),
    new Tile('c'),
    new Tile('d'),
];

const tileSize = 100;

function createBoard(size) {
    let distanceFromTop = 0;
    let distanceFromLeft = 0;
    let col, row;

    $('#main').css('height', (tileSize * size) + "px");
    $('#main').css('width', (tileSize * size) + "px");

    for(row = 0; row < size; row ++) {
        for (col = 0; col< size; col++) {
            let tileNumber = size * row + col;
            $('#main').append(
            "<div class=\"tile\" id=" + tileNumber +"> " + tiles[tileNumber].text + "</div>"
        );
            $('#' + tileNumber).css('top', distanceFromTop + "px");
            $('#' + tileNumber).css('left', distanceFromLeft + "px");
            $('#' + tileNumber).css('height', tileSize + "px");
            $('#' + tileNumber).css('width', tileSize + "px");

            distanceFromLeft += tileSize;
        }
        distanceFromLeft = 0;
        distanceFromTop += tileSize;
    }

}


