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
    const GAME_OVER = 'game_over';
    //players
    let player1 = Player('p1', 'X');
    let player2 = Player('p2', 'O');

    let currentState = PLAYER_TURN;
    let currentPlayer;
    //public
    const clickFunction = (e) => {
        //attached to each gameTile on _gameTiles creation
        let index = e.target.getAttribute('index');
        switch (currentState) {
            case PLAYER_TURN:
                if (currentPlayer === undefined) currentPlayer = player1;
                let piece = currentPlayer.getPiece();
                if (gameboard.placePiece(index, piece)) {
                    let winningIndexes = checkGameEnd();
                    if (winningIndexes) {
                        _gameEnd(winningIndexes);
                    } else __nextTurn();

                } else console.log('tile already taken');
                break;
            case GAME_OVER:
                gameMenu.toggleDisplay();
                break;
            default: console.log(`Unknown state: ${currentState}`);
        }
    }
    const setPlayer1 = (name, marker) => {
        player1 = Player(name, marker);
    }
    const setPlayer2 = (name, marker) => {
        player2 = Player(name, marker);
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
    const _gameEnd = (winningIndexes) => {
        currentState = GAME_OVER;
        if (winningIndexes.length < 3) {
            gameMenu.setWinMessage();
        }
        else if (currentPlayer === player1) {
            player1.addWin();
            gameMenu.setWinMessage(player1.getName());
        }
        else {
            player2.addWin();
            gameMenu.setWinMessage(player2.getName());
        }
        gameMenu.setCardStats(player1.getName(), player1.getWins(), 1);
        gameMenu.setCardStats(player2.getName(), player2.getWins(), 2);
        gameboard.setWinningTilesAnimation(winningIndexes);
    }
    const setNewGame = (newPlayers = false) => {
        currentState = PLAYER_TURN;
        if (newPlayers) currentPlayer = player1;
        gameboard.reset();
    }
    const getCurrentPlayer = () => {
        return currentPlayer;
    }
    const getCurrentState = ()=>{
        return currentState;
    }
    //private
    const __nextTurn = () => {
        if (currentPlayer === player1)
            currentPlayer = player2;
        else currentPlayer = player1;
    }

    return { clickFunction, setPlayer1, setPlayer2, setNewGame, getCurrentPlayer, getCurrentState };
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
    const _onTileEnter = (e) => {
        if(gameMechanics.getCurrentState() === 'game_over') return;
        let tile = e.target;
        let index = tile.getAttribute('index');
        if (_board[index] !== undefined) {
            tile.classList.add('invalidTile');
        } else {
            tile.classList.add('validTile');
            tile.textContent = gameMechanics.getCurrentPlayer().getPiece();
        }
    }
    const _onTileLeave = (e) => {
        let tile = e.target;
        let index = tile.getAttribute('index');
        if (_board[index] === undefined) tile.textContent = '';
        tile.classList.remove('invalidTile');
        tile.classList.remove('validTile');
    }

    const _boardTiles = (() => {
        const gameBoard = document.getElementById('gameBoard');
        let boardTiles = [];
        for (let i = 0; i < 9; i++) {
            boardTiles.push(document.createElement('boardTile'));
            boardTiles[i].setAttribute('index', i);
            boardTiles[i].addEventListener('click', gameMechanics.clickFunction);
            boardTiles[i].addEventListener('mouseenter', _onTileEnter);
            boardTiles[i].addEventListener('mouseleave', _onTileLeave);
            gameBoard.appendChild(boardTiles[i]);
        }
        return boardTiles;
    })();
    const _resetBoardTiles = () => {
        _boardTiles.forEach(element => {
            element.innerText = '';
            element.classList.remove('winningTile');
        })
    }
    function setWinningTilesAnimation(tiles) {
        if (tiles.length !== 3) { return; }
        tiles.forEach(index => _boardTiles[index].classList.add('winningTile'));
    }
    return { reset, placePiece, getBoard, setWinningTilesAnimation };
})();

const gameMenu = (() => {
    //references
    const _gameBox = document.getElementById('gameBox')
    const _menu = document.getElementById('gameMenu');
    //screen references
    const _sc_start = document.getElementById('menu_start');

    const _sc_select = document.getElementById('menu_playerSelect');
    const _button_startGame = document.getElementById('menu_button_start-game');
    const _input_p1Name = document.getElementById('input_p1-name');
    const _input_p2Name = document.getElementById('input_p2-name');
    const _input_p1Marker = document.getElementById('input_p1-marker');
    const _input_p2Marker = document.getElementById('input_p2-marker');

    const _sc_end = document.getElementById('menu_game-over');
    const _output_winMessage = document.getElementById('menu_win-message');
    const _output_p1Name = document.getElementById('menu_p1-card_name');
    const _output_p1Score = document.getElementById('menu_p1-card_score');
    const _output_p2Name = document.getElementById('menu_p2-card_name');
    const _output_p2Score = document.getElementById('menu_p2-card_score');
    const _button_newGame = document.getElementById('menu_button_new-game');
    const _button_playAgain = document.getElementById('menu_button_play-again');

    //private methods
    const _display = (() => {
        let _displayed = true;
        _menu.addEventListener('transitionend', _onDisplayTransitionEnd);
        function toggleDisplay() {
            _toggleDisplayed();
            if (_getDisplayed()) {
                _menu.style.display = 'block';
                _menu.offsetHeight;
                _menu.style.opacity = 1;
            } else { _menu.style.opacity = 0; }
        }
        function _onDisplayTransitionEnd() {
            if (!_getDisplayed()) { _menu.style.display = 'none'; }
        }
        function _getDisplayed() {
            return _displayed;
        }
        function _toggleDisplayed() {
            _displayed = !_displayed
            return _displayed;
        }
        return { toggleDisplay };
    })()
    //public methods
    const toggleDisplay = () => {
        _display.toggleDisplay();
    }
    //Sets endgame menu player score cards. player only accepts 1 or 2;
    const setCardStats = (name, score, player) => {
        let outputName;
        let outputScore;
        if (name === undefined) name = 'Error';
        if (score === undefined) score = 'E';
        if (player !== 1 && player !== 2) { console.log('Player undefined.'); return; }
        if (player === 1) {
            outputName = _output_p1Name;
            outputScore = _output_p1Score;
        } else {
            outputName = _output_p2Name;
            outputScore = _output_p2Score;
        }
        outputName.textContent = `${name} Wins:`
        outputScore.textContent = score;
    }
    //pass 1 for player1, 2 for player2, nothing for draw
    const setWinMessage = (name) => {
        let message = '';
        if (name === undefined) message = "It's a Draw!"
        else {
            message = `${name} Wins!`;
        }
        _output_winMessage.textContent = message;
    }
    //event listeners
    _sc_start.addEventListener('click', () => {
        _sc_start.classList.add('hidden');
        _sc_select.classList.remove('hidden');
    })
    _button_startGame.addEventListener('click', () => {
        p1Name = _input_p1Name.value;
        p1Marker = _input_p1Marker.value;
        p2Name = _input_p2Name.value;
        p2Marker = _input_p2Marker.value;
        gameMechanics.setPlayer1(p1Name, p1Marker);
        gameMechanics.setPlayer2(p2Name, p2Marker);
        gameMechanics.setNewGame(true);
        toggleDisplay();
        _sc_select.classList.add('hidden');
        _sc_end.classList.remove('hidden');

    })
    _button_newGame.addEventListener('click', () => {
        _sc_end.classList.add('hidden');
        _sc_select.classList.remove('hidden');
    })
    _button_playAgain.addEventListener('click', () => {
        gameMechanics.setNewGame();
        toggleDisplay();
    })
    return { toggleDisplay, setCardStats, setWinMessage };
})()
