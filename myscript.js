const Player = (name, gamepiece) => {
    let wins = 0;

    const getName = () => { return name };
    const getPiece = () => { return gamepiece; };
    const addWin = () => { wins++; };
    const getWins = () => { return wins; };
    return { getName, getPiece, addWin, getWins };

};
const gameMechanics = (() => {
    //gamestates
    const PLAYER_TURN = 'player_turn';
    //players
    const player1 = Player('p1', 'X');
    const player2 = Player('p2', 'O');

    let currentState = PLAYER_TURN;
    let currentPlayer = player1;
    //public
    const clickFunction = (e) => {
        //attached to each gameTile on _gameTiles creation
        let index = e.target.getAttribute('index');
        switch (currentState) {
            case PLAYER_TURN:
                let piece = currentPlayer.getPiece();
                if (gameboard.placePiece(index, piece)) {
                    let winningIndexes = checkGameEnd();
                    if (winningIndexes) {
                        console.log(`Game Ended: ${winningIndexes}`);
                    } else __nextTurn();

                } else console.log('tile already taken');
                break;
            default: console.log(`Unknown state: ${currentState}`);
        }
    }
    /** returns array of three winning indexes on win or [-1] on draw */
    const checkGameEnd = () => {
        /**this is a test */
        //returns array of three winning indexes if game was won and 
        const board = gameboard.getBoard();
        return _checkHorozontal() || _checkVertical() || _checkDiagonal() || _checkDraw();
        function _checkHorozontal() {
            let piece = undefined;
            for (let i = 0; i < 3; i++) {
                let index = i * 3;
                if (board[index] === undefined) continue;
                else piece = board[index];
                if (board[index + 1] !== piece) continue;
                if (board[index + 2] !== piece) continue;
                return [index, (index + 1), (index + 2)];
            }
            return false;
        }
        function _checkVertical() {
            let piece = undefined;
            for (let index = 0; index < 3; index++) {
                if (board[index] === undefined) continue;
                else piece = board[index];
                if (board[index + 3] !== piece) continue;
                if (board[index + 6] !== piece) continue;
                return [index, (index + 3), (index + 6)];
            }
            return false;
        }
        function _checkDiagonal() {
            let piece = undefined;
            if (board[4] === undefined) return false;
            else piece = board[4];
            if (board[0] === piece) {
                if (board[8] === piece) return [0, 4, 8];
            }
            if (board[2] === piece) {
                if (board[6] === piece) return [2, 4, 6];
            }
            return false;
        }
        function _checkDraw() {
            for (let i = 0; i < board.length; i++) {
                if (board[i] === undefined) return false;
            }
            return [-1];
        }
    };
    //private
    const __nextTurn = () => {
        if (currentPlayer === player1)
            currentPlayer = player2;
        else currentPlayer = player1;
    }

    return { clickFunction };
})();

const gameboard = (() => {
    let _board = new Array(9);
    const reset = () => {
        _board = new Array(9);
        _resetBoardTiles();
    };
    const getBoard = () => { return _board };
    const placePiece = (index, piece) => {
        if (_board[index] !== undefined) return false;
        _board[index] = piece;
        _boardTiles[index].innerText = piece;
        return true;
    };
    const _boardTiles = (() => {
        const gameBoard = document.getElementById('gameBoard');
        let boardTiles = [];
        for (let i = 0; i < 9; i++) {
            boardTiles.push(document.createElement('boardTile'));
            boardTiles[i].setAttribute('index', i);
            boardTiles[i].addEventListener('click', gameMechanics.clickFunction);
            gameBoard.appendChild(boardTiles[i]);
        }
        return boardTiles;
    })();
    const _resetBoardTiles = () => {
        _boardTiles.forEach(element => {
            element.innerText = '';
        })
    }
    return { reset, placePiece, getBoard };
})();
const gameMenu = (() => {
    const _gameBox = document.getElementById('gameBox')
    const _menu = document.getElementById('gameMenu');
    let _displayed = true;
    _gameBox.appendChild(_menu);
    function toggleDisplay() {
        if (_displayed) {
            _menu.classList.add('hidden');
        } else {
            _menu.classList.remove('hidden');
        }
        _displayed = !_displayed;
    }

    return {toggleDisplay};
})()

