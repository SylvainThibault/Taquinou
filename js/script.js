let tileSize = 100;

let board = new Board(tileSize,4);

$(document).ready(function(){
    display(board);
});

function permuteWithEmptyTile($tile) {
    $('.tile').finish();
    let tilePosition = $tile.attr('id');
    if (board.canMove(tilePosition)) {
        let permutationResult = board.permuteWithEmptyTile(tilePosition);
        slide(tilePosition, permutationResult.direction, tileSize);
        $tile.attr('id',permutationResult.newTilePosition);
        setTimeout(function(){}, 500);
    }
}

function display(board){

    $('#main').empty().css({
        'height': (board.tileSize * board.boardSize) + "px",
        'width': (board.tileSize * board.boardSize) + "px"
    });

    for (row = 0; row < board.boardSize; row++) {
        for (col = 0; col < board.boardSize; col++) {
            let currentTile = board.tilesArray[row][col];
            let tilePosition = currentTile.row* board.boardSize + currentTile.column;
            if(!currentTile.isEmpty){
            $('#main').append(
                "<div class=\"tile\" id=" + tilePosition + "> " + currentTile.text + "</div>"
        );
            $('#' + tilePosition).css({
                'top': currentTile.row * board.tileSize + "px",
                'left': currentTile.column * board.tileSize + "px",
                'height': board.tileSize + "px",
                'width': board.tileSize + "px"
                });
            }
        }
        displayWinOrLose();
    }

    $('.tile').click(function () {
        permuteWithEmptyTile($(this));
        displayWinOrLose();
    });
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
    $('#' + tileId).animate({
        left: xTranslation + 'px',
        top: yTranslation + 'px'
    }, 500);
}

function generateNewBoard(){
    let newBoardSize = $('#boardSizeInput').val();
    tileSize = +$('#tileSizeInput').val();
    board = new Board(tileSize, newBoardSize);
    display(board);
}

function moveEmptyTile(){
    let n = $('#moveNumber').val();
    board.moveEmptyTile(n);
    display(board);
}

function displayWinOrLose(){
    if (board.checkWinCondition()){
        $('#status').text("RESOLVED");
        $('#status').css('color', 'green');
    } else {
        $('#status').text("UNRESOLVED");
        $('#status').css('color', 'red');
    }
}

function checkBoardSolvable(){
    if (board.solvable()){
        alert("t'as cru j'allais t'entuber? sale noob");
    } else {
        alert("bien joué p'tit malin, y'a pas de solution! MOUHAHAHA");
    }
}

function samLoydStupidConfiguration() {
    board = new Board(100,4);
    board.permute(13,14);
    display(board);
}