const Player = (name, mark) => {
    const getName = () => name
    const getMark = () => mark
    return {getName, getMark}
}

const GameBoard = (() => {
    let board, winner, gameEnd, player1, player2, nextTurnPlayer;
    const initialize = (p1 = player1, p2 = player2) => {
        player1 = p1
        player2 = p2
        board = [
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ]
        winner = null
        gameEnd = false
        nextTurnPlayer = player1
    }
    const getWinner = () => winner
    const isGameEnd = () => gameEnd
    const getMarkAt = (x, y) => {
        if (board[x] !== undefined && board[x][y] !== undefined) {
            return board[x][y]
        } else {
            return undefined
        }
    }
    const setMarkAt = (x, y, mark) => {
        if (gameEnd) return false
        if (board[x] !== undefined && board[x][y] !== undefined && board[x][y] === null) {
            board[x][y] = mark
            return true
        } else return false
    }
    const swapNextTurnPlayer = () => nextTurnPlayer = nextTurnPlayer === player1 ? player2 : player1
    const getPlayerByMark = (mark) => player1.getMark() === mark ? player1 : player2
    const calculateWinner = () => {
        for (let x = 0; x < board.length; x++) {
            if (board[x][0] !== null && board[x][0] === board[x][1] && board[x][0] === board[x][2]) {
                return getPlayerByMark(board[x][0])
            }
        }
        for (let y = 0; y < board[0].length; y++) {
            if (board[0][y] !== null && board[0][y] === board[1][y] && board[0][y] === board[2][y]) {
                return getPlayerByMark(board[0][y])
            }
        }
        if ((board[0][0] !== null && board[0][0] === board[1][1] && board[0][0] === board[2][2]) ||
            (board[0][2] !== null && board[0][2] === board[1][1] && board[0][2] === board[2][0])) {
            return getPlayerByMark(board[1][1])
        }
        return null
    }
    const isBoardFull = () => {
        for (let x = 0; x < board.length; x++) {
            for (let y = 0; y < board[x].length; y++) {
                if (board[x][y] === null) return false
            }
        }
        return true
    }
    const updateGameStatus = () => {
        winner = calculateWinner()
        if (winner !== null) {
            gameEnd = true
        } else {
            gameEnd = isBoardFull()
        }
    }
    const playerTurn = (x, y) => {
        if (setMarkAt(x, y, nextTurnPlayer.getMark())) {
            updateGameStatus()
            swapNextTurnPlayer()
        }
    }

    return {initialize, getWinner, isGameEnd, playerTurn, getMarkAt}
})()

const DisplayController = (() => {
    const drawGameBoard = () => {
        let html = ''
        for (let x = 0; x < 3; x++) {
            html += "<div class='row'>"
            for (let y = 0; y < 3; y++) {
                let mark = GameBoard.getMarkAt(x, y) === null ? '' : GameBoard.getMarkAt(x, y)
                html += `<div class='cell' data-x='${x}' data-y='${y}'` +
                    `onclick="DisplayController.cellClick(this)" >` +
                    `${mark}</div>`
            }
            html += "</div>"
        }
        document.getElementById('container').innerHTML = html
    }
    const cellClick = (element) => {
        GameBoard.playerTurn(element.dataset.x, element.dataset.y)
        drawGameBoard()
        updateGameStatus()
    }
    const restartClick = () => {
        GameBoard.initialize()
        drawGameBoard()
        document.getElementById('status').innerHTML = ''
    }
    const updateGameStatus = () => {
        if (GameBoard.isGameEnd()) {
            let html = "<h3>Game is End. "
            if (GameBoard.getWinner() === null) {
                html += "No winners!</h3>"
            } else html += `${GameBoard.getWinner().getName()} win!</h3>`
            html += "<button onclick='DisplayController.restartClick()'>Restart</button>"
            document.getElementById('status').innerHTML = html
        }
    }
    return {drawGameBoard, cellClick, restartClick}
})
()

//----------- Initialize ----------------
document.addEventListener("DOMContentLoaded", function () {
    GameBoard.initialize(Player('Bob', 'O'), Player('Anna', 'X'))
    DisplayController.drawGameBoard()
});