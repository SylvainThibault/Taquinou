let board = new Board(100,4);

$(document).ready(function() {
    displayBoard();
    refreshBoard();
    newBoard();
    shuffleBoard();

});

function moveTile(tile, direction, board){
    let tileSize = board.tileSize;
    let tileTop = parseInt($(tile).css('top'), 10);
    let tileLeft = parseInt($(tile).css('left'), 10);

    switch(direction){
        case 'U':
            tileTop -= tileSize;
            break;
        case 'R':
            tileLeft += tileSize;
            break;
        case 'D':
            tileTop += tileSize;
            break;
        case 'L':
            tileLeft -= tileSize;
            break;
    }

    $(tile).animate({
        top: tileTop + "px",
       left: tileLeft + "px"
    });
}

function displayBoard() {
    let distanceFromTop = 0;
    let distanceFromLeft = 0;
    let col, row;

    $('#main').empty().css({
        'height': (board.tileSize * board.boardSize) + "px",
        'width': (board.tileSize * board.boardSize) + "px"
    });

    for (row = 0; row < board.boardSize; row++) {
        for (col = 0; col < board.boardSize; col++) {
            let tileNumber = board.boardSize * row + col;
            $('#main').append(
                "<div class=\"tile\" id=" + tileNumber + "><div><h1>" + board.tilesArray[row][col].text + "</h1></div></div>"
            );
            $('#' + tileNumber).css({
                'top': distanceFromTop + "px",
                'left': distanceFromLeft + "px",
                'height': board.tileSize + "px",
                'width': board.tileSize + "px"
            });
            if (board.tilesArray[row][col].isEmpty) {
                $('#' + tileNumber).css('display', 'none');
            }
            distanceFromLeft += board.tileSize;
        }
        distanceFromLeft = 0;
        distanceFromTop += board.tileSize;
    }

    onTileClick(board);
}

function onTileClick() {
    $('.tile').click(function () {
        $(".tile").finish();
        let direction = board.checkForEmptyTile(this);
        moveTile(this, direction, board);
        taquinouComplete();
    });
}

function refreshBoard() {
    $('#refreshBoard').click(function () {
        board = new Board(board.tileSize , board.boardSize);
        displayBoard(board);
    });
}

function newBoard(){
    $("#newBoard").click(function() {
        let boardSize = +$("#boardSize").val();
        let tileSize = +$("#tileSize").val();
        board = new Board(tileSize, boardSize);
        displayBoard(board);
    });
}

function shuffleBoard(){
    $('#shuffleBoard').click(function() {
        let nbOfShuffles = $('#nbOfShuffles').val();
        board.shuffle(nbOfShuffles);
        displayBoard(board);
    })
}

function taquinouComplete(){
    $("#taquinouComplete").text("INCOMPLETE").css('color' , 'red');
    if(board.win()){
        $("#taquinouComplete").text("COMPLETE!!").css('color' , 'green');
    }
}