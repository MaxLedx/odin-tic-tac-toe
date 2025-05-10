function createPlayer(name, token) {
    return { name, token };
}

const gameBoard = (function () {
    const board = new Array(9);

    function isWithinBounds(position) {
        return position >= 0 && position < board.length;
    }

    function getBoard() {
        return [...board];
    }

    function getTokenAtOrDefault(position) {
        return isWithinBounds(position) ? board[position] : null;
    }

    function trySetTokenAt(token, position) {
        if (!isWithinBounds(position) || board[position] !== undefined) {
            return false;
        }
        board[position] = token;
        return true;
    }

    return { getBoard, getTokenAtOrDefault, trySetTokenAt };
})();

const game = (function (gameBoard, playerOne, playerTwo, onWinEventHandler, onTieEventHandler) {
    const WIN_POSITIONS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const LAST_ROUND = 8;

    let round = 0;

    let gameFinished = false;

    function incrementRound() {
        round++;
    }

    function checkForWinner(token) {
        for (const winPosition of WIN_POSITIONS) {
            if (winPosition.every(position => gameBoard.getTokenAtOrDefault(position) === token)) {
                return true;
            }
        }
        return false;
    }

    function playRound(position) {
        if (gameFinished) return;
        const roundPlayer = round % 2 === 0 ? playerOne : playerTwo;

        if (gameBoard.trySetTokenAt(roundPlayer.token, position)) {
            if (checkForWinner(roundPlayer.token)) {
                gameFinished = true;
                onWinEventHandler(roundPlayer);
            } else if (round === LAST_ROUND) {
                gameFinished = true;
                onTieEventHandler();
            }

            incrementRound();
        }
    }

    return { playRound };
})(
    gameBoard,
    createPlayer('Test 1', 'X'),
    createPlayer('Test 2', 'O'),
    (player) => console.log(player.name),
    () => console.log('Tie')
);

const displayController = (function (document, gameBoard, game) {
    const buttons = [...document.querySelectorAll('.grid-button')];

    for (const button of buttons) {
        const position = button.getAttribute('id');
        button.addEventListener('click', () => {
            game.playRound(position);
            render();
        });
    }

    function render() {
        const board = gameBoard.getBoard();
        for (let i = 0; i < board.length; i++) {
            const token = board[i];
            buttons[i].textContent = token;
        }
    }
})(document, gameBoard, game);