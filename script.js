function createPlayer(name, token) {
    return { name, token };
}

const gameBoard = (function () {
    const board = new Array(9);

    function isWithinBounds(position) {
        return position >= 0 && position < board.length - 1;
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

    const FIRST_WINNABLE_ROUND = 4;

    const LAST_ROUND = 8;

    let round = 0;

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
        const roundPlayer = round % 2 === 0 ? playerOne : playerTwo;
        if (gameBoard.trySetTokenAt(roundPlayer.token, position)) {
            if (round >= FIRST_WINNABLE_ROUND) {
                const hasWinner = checkForWinner(roundPlayer.token)
                if (hasWinner) {
                    onWinEventHandler(roundPlayer);
                } else {
                    if (round === LAST_ROUND) {
                        onTieEventHandler();
                    }
                }
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