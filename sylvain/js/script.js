let board = new Board(100, 3);

$(document).ready(function () {
    displayBoard();
    refreshBoard();
    newBoard();
    shuffleBoard();
    randomizeBoard();
    playSolution();
    dfs();
});

function moveTile(tile, direction, board) {
    let tileSize = board.tileSize;
    let tileTop = parseInt($(tile).css('top'), 10);
    let tileLeft = parseInt($(tile).css('left'), 10);

    switch (direction) {
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
        'height': (board.tileSize * board.boardSize)+ (board.boardSize -1 ) + "px",
        'width': (board.tileSize * board.boardSize)+ (board.boardSize - 1) + "px"
    });

    for (row = 0; row < board.boardSize; row++) {
        for (col = 0; col < board.boardSize; col++) {
            let tileNumber = board.tilesArray[row][col].id;
            $('#main').append(
                "<div class=\"tile\" id=\"" + tileNumber + "\">" + board.tilesArray[row][col].text + "</div>"
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
    parityDisplay();
    taquinouComplete();
}

function onTileClick() {
    $('.tile').click(function () {
        $(".tile").finish();
        let tile = board.returnSelectedTile(this);
        let direction = board.checkForPossibleDirections(tile);
        moveTile(this, direction, board);
        taquinouComplete();
    });
}

function refreshBoard() {
    $('#refreshBoard').click(function () {
        board = new Board(board.tileSize, board.boardSize);
        displayBoard();
    });
}

function newBoard() {
    $("#newBoard").click(function () {
        let boardSize = +$("#boardSize").val();
        let tileSize = +$("#tileSize").val();
        board = new Board(tileSize, boardSize);
        displayBoard();
    });
}

function shuffleBoard() {
    $('#shuffleBoard').click(function () {
        let nbOfShuffles = $('#nbOfShuffles').val();
        board.tileShuffle(nbOfShuffles);
        displayBoard();
        taquinouComplete();
    })
}

function randomizeBoard() {
    $('#randomizeBoard').click(function () {
        board.randomizeBoard();
        displayBoard();
    })
}

function taquinouComplete() {
    $("#taquinouComplete").text("INCOMPLETE").css('color', 'red');
    if (board.win()) {
        $("#taquinouComplete").text("COMPLETE!!").css('color', 'green');
    }
}

function parityDisplay() {
    if (board.checkEmptyTileParity()) {
        $("#emptyParity").text("Even");
    } else {
        $("#emptyParity").text("Odd");
    }
    if (board.checkSolutionParityBibiStyle()) {
        $("#solutionParity").text("Even");
    } else {
        $("#solutionParity").text("Odd");
    }
    if (board.checkSolutionParityBibiStyle() === board.checkEmptyTileParity()) {
        $("#solvability").text("Pössible").css('color', 'green');
    } else {
        $("#solvability").text("Impössible").css('color', 'red');
    }
    if (board.checkSolutionParityWithSelectionSort() === board.checkEmptyTileParity()) {
        $("#selectionSort").text("Pössible").css('color', 'green');
    } else {
        $("#selectionSort").text("Impössible").css('color', 'red');
    }
}

function returnQueryTileToMove(direction) {
    let emptyTile = board.returnEmptyTile();
    let selectedTile;
    let newDirection;

    switch (direction) {
        case 'U':
            selectedTile = board.tilesArray[emptyTile.row - 1][emptyTile.col];
            newDirection = 'D';
            break;
        case 'R':
            selectedTile = board.tilesArray[emptyTile.row][emptyTile.col + 1];
            newDirection = 'L';
            break;
        case 'D':
            selectedTile = board.tilesArray[emptyTile.row + 1][emptyTile.col];
            newDirection = 'U';
            break;
        case 'L':
            selectedTile = board.tilesArray[emptyTile.row][emptyTile.col - 1];
            newDirection = 'R';
            break;
    }
    let queryTile = $('#' + selectedTile.id);

    return function () {
        moveTile(queryTile, newDirection, board);
    }
}

function dfs() {
    $('#dfs').click(function () {
        let arrayOfindexes = board.toDoubleArrayOfIndexes(board.tilesArray);
        board.startDfs(arrayOfindexes, 0);

        if (board.bestMoves.length) {
            $('#dfsText').text("Solution found").css("color", "green");
            $('#solutionText').empty().text(board.bestMoves.toString());
        } else {
            $('#dfsText').text("Solution not found").css("color", "red");
        }
    });
}

function playSolution() {
    $('#playSolution').click(function () {
        let queryMovesArray = returnQueryMovesArray();
        for (let i = 0; i < queryMovesArray.length; i++) {
            setTimeout(queryMovesArray[i], 2000*i);
        }
    });
}

function returnQueryMovesArray() {
    let queryMovesArray = [];
    let solutionArray = board.movesArray;
    for (let i = 0; i < solutionArray.length; i++) {
        let nextDirection = solutionArray[i];
        queryMovesArray.push(returnQueryTileToMove(nextDirection));
    }
    console.log(queryMovesArray);
    return queryMovesArray;
}