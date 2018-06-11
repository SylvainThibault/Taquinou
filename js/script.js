$(document).ready(function () {

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

        $('#main').empty().css({
            'height': (tileSize * size) + "px",
            'width': (tileSize * size) + "px"
        });

        for (row = 0; row < size; row++) {
            for (col = 0; col < size; col++) {
                let tileNumber = size * row + col;
                $('#main').append(
                    "<div class=\"tile\" id=" + tileNumber + "> " + tiles[tileNumber].text + "</div>"
                );
                $('#' + tileNumber).css({
                    'top': distanceFromTop + "px",
                    'left': distanceFromLeft + "px",
                    'height': tileSize + "px",
                    'width': tileSize + "px"
                });

                distanceFromLeft += tileSize;
            }
            distanceFromLeft = 0;
            distanceFromTop += tileSize;
        }

    }
});