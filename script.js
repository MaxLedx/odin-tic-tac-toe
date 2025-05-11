function createPlayer(name, token) {
    return { name, token };
}

function createGameBoard() {
    const board = new Array(9);

    function getBoard() {
        return [...board];
    }

    function trySetTokenAt(token, position) {
        if (position < 0 || position >= board.length || board[position] !== undefined) {
            return false;
        }
        board[position] = token;
        return true;
    }

    return {
        getBoard,
        trySetTokenAt
    };
}

function createGame(gameBoard) {
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

    let playerOne = null;

    let playerTwo = null;

    let onGameFinished = null;

    function incrementRound() {
        round++;
    }

    function setPlayerOne(player) {
        playerOne = player;
    }

    function setPlayerTwo(player) {
        playerTwo = player;
    }

    function setOnGameFinished(eventHandler) {
        onGameFinished = eventHandler;
    }

    function checkForWinner(token) {
        const board = gameBoard.getBoard();
        for (const winPosition of WIN_POSITIONS) {
            if (winPosition.every(position => board[position] === token)) {
                return true;
            }
        }
        return false;
    }

    function playRound(position) {
        const roundPlayer = round % 2 === 0 ? playerOne : playerTwo;

        if (gameBoard.trySetTokenAt(roundPlayer.token, position)) {
            if (checkForWinner(roundPlayer.token)) {
                onGameFinished(roundPlayer);
            } else if (round === LAST_ROUND) {
                onGameFinished();
            }

            incrementRound();
        }
    }

    return { playRound, setPlayerOne, setPlayerTwo, setOnGameFinished };
}

function createDisplayController(document, gameBoard, game) {
    let grid = null;

    let onReset = null;

    const playersFormElement = document.querySelector('.players-form');

    playersFormElement.addEventListener('submit', event => {
        event.preventDefault();
        const playerOneElement = document.querySelector('#player-one');
        const playerTwoElement = document.querySelector('#player-two');
        game.setPlayerOne(createPlayer(playerOneElement.value, 'X'));
        game.setPlayerTwo(createPlayer(playerTwoElement.value, 'O'));
        game.setOnGameFinished(renderResult);
        playersFormElement.remove();
        createGrid();
    });

    function createGrid() {
        grid = document.createElement('div');
        grid.classList.add('grid');
        for (let i = 0; i < 9; i++) {
            const button = document.createElement('button');
            button.classList.add('grid-button');
            button.addEventListener('click', () => {
                game.playRound(i);
                renderGrid();
            });
            grid.appendChild(button);
        }
        document.querySelector('body').appendChild(grid);
    }

    function renderGrid() {
        const buttons = [...document.querySelectorAll('.grid-button')];
        if (buttons.length === 9) {
            const board = gameBoard.getBoard();
            for (let i = 0; i < board.length; i++) {
                const token = board[i];
                buttons[i].textContent = token;
            }
        }
    }

    function renderResult(winner = null) {
        grid.remove();
        const result = document.createElement('div');
        winner === null ? result.textContent = 'Tie!' : result.textContent = `Winner: ${winner.name}`;
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Restart game';
        resetButton.addEventListener('click', () => onReset());
        const body = document.querySelector('body');
        body.appendChild(result);
        body.appendChild(resetButton);
    }

    function setOnReset(eventHandler) {
        onReset = eventHandler;
    }

    return { setOnReset };
}

function main(document) {
    const gameBoard = createGameBoard();
    const game = createGame(gameBoard);
    const displayController = createDisplayController(document, gameBoard, game);
    displayController.setOnReset(() => window.location.reload());
}

main(document);