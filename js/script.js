let tileSize = 100;

let board = new Board(tileSize,4);

window.onload = function(){
    display(board);

  }

function permuteWithEmptyTile(tileId) {
    let emptyTileId = board.boardSize * board.boardSize - 1;
    if (board.canMove(tileId)) {
        let direction = board.permute(tileId, emptyTileId);
        slide(tileId, direction, tileSize);
    }
}

function display(board){
    let distanceFromTop = 0;
    let distanceFromLeft = 0;
    let col, row;

    $('#main').empty().css({
        'height': (board.tileSize * board.boardSize) + "px",
        'width': (board.tileSize * board.boardSize) + "px"
    });

    for (row = 0; row < board.boardSize; row++) {
        for (col = 0; col < board.boardSize; col++) {
            let currentId = board.tilesArray[row][col].id;
            if(!board.tilesArray[row][col].isEmpty){
            $('#main').append(
                "<div class=\"tile\" id=" + currentId + " onclick=\"permuteWithEmptyTile(" +
                + currentId + ")\"> " + board.tilesArray[row][col].text + "</div>"
        );
            $('#' + currentId).css({
                'top': distanceFromTop + "px",
                'left': distanceFromLeft + "px",
                'height': board.tileSize + "px",
                'width': board.tileSize + "px"
            });

            }
            distanceFromLeft += board.tileSize;
        }
        distanceFromLeft = 0;
        distanceFromTop += board.tileSize;
    }
}

function slide(tileId, direction, tileSize) {
    let xTranslation = 0, yTranslation = 0;

    switch (direction) {
        case 'toLeft':
            xTranslation = -tileSize;
            break;
        case 'toRight':
            xTranslation = tileSize;
            break;
        case 'toTop':
            yTranslation= -tileSize;
            break;
        case 'toBottom':
            yTranslation = tileSize;
            break;

    }
    let originalxPosition = $('#' + tileId).css('left');
    let originalyPosition = $('#' + tileId).css('top');
    xTranslation += +originalxPosition.substr(0, originalxPosition.indexOf('px'));
    yTranslation += +originalyPosition.substr(0, originalyPosition.indexOf('px'));
    $('#' + tileId).css({
        left: xTranslation + 'px',
        top: yTranslation + 'px'
    });
}