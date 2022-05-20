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
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // set "board" to empty HEIGHT x WIDTH matrix array, all initialized to null
  for(let y = 0; y < HEIGHT; y++){
    board.push(Array(WIDTH).fill(null));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector('#board')
  // create the clickable top row of boxes; circles will be dropped down from here on click into the clicked column
  const top = document.createElement("tr");
  // give an id of column-top
  top.setAttribute("id", "column-top");
  top.classList.add(`player${currPlayer}`);
  // add event listener on click to entire row
  top.addEventListener("click", handleClick);

  // create td element for each column w/ id of column #, append to table row
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // construct the rest of the board in html, adding the rows and columns with td table elements and tr table rows; each cell will have coordinates as id
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
  for(let y = HEIGHT - 1; y >= 0; y--){
    if(!board[y][x]){
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // make a div and insert into correct table cell
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
    placeInTable(y, x);
    // update in-memory board
    board[y][x] = currPlayer;

    // check for win
    if (checkForWin()) {
      return endGame(`PLAYER ${currPlayer} won!`);
    }

    // check for tie
    // check if all cells in board are filled; if so call, call endGame
    const allCellsFilled = board.every(row => row.every(cell => cell !== null));
    if(allCellsFilled) endGame('TIE!');
    // switch currPlayer 1 <-> 2
    currPlayer = currPlayer === 1? 2: 1;
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

// reset function
function reset(){
  currPlayer = 1;
  gameInPlay = true;
  // clear board
  board = [];
  makeBoard();
  console.log(board);
  // clear dom
  const htmlBoard = document.querySelector('#board');
  htmlBoard.innerHTML = "";
  makeHtmlBoard();
}

makeBoard();
makeHtmlBoard();

// reset
const resetBtn = document.querySelector('#reset');
resetBtn.addEventListener('click', reset);
