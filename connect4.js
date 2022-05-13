/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let gameInPlay = true;
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  for(let r = 0; r < HEIGHT; r++){
    board.push([]);
    for(let c = 0; c < WIDTH; c++){
      board[r][c] = null;
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector('#board')
  // TODO: create the clickable top row full of boxes where circles will be dropped down into the column from, add event listener on click to row 
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.classList.add('player1');
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: construct the rest of the board in html, adding the rows and columns with td table elements and tr table rows 
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for(let r = HEIGHT - 1; r >= 0; r--){
    if(board[r][x] === null){
      return r;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const connectFourPiece = document.createElement('div');
  connectFourPiece.classList.add("piece");
  connectFourPiece.classList.add(`player${currPlayer}`);
  // alternate top row colors depending on player
  const topRow = document.getElementById('column-top');
  topRow.classList.toggle('player1');
  topRow.classList.toggle('player2');
  // grab correct tabel cell html element with id
  const tableCell = document.getElementById(`${y}-${x}`);
  tableCell.appendChild(connectFourPiece);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  gameInPlay = false;
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // only run logic if game is being played, i.e. no one has won
  if(gameInPlay){
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    // TODO: add line to update in-memory board
    placeInTable(y, x);
    board[y][x] = currPlayer;

    // check for win
    if (checkForWin()) {
      return endGame(`Player ${currPlayer} won!`);
    }

    // check for tie
    // TODO: check if all cells in board are filled; if so call, call endGame
    const allCellsFilled = board.slice(1).every(row => row.every(cell => cell !== null));
    if(allCellsFilled) endGame();
    // switch players
    // TODO: switch currPlayer 1 <-> 2
    currPlayer === 1? currPlayer = 2: currPlayer = 1;
  }
}
  

/** checkForWin: check board cell-by-cell for "does a win start here?" */ 

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
