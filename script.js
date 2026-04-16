const boardSize = 15;
const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const restartButton = document.getElementById("restartButton");

let board = [];
let currentPlayer = "black";
let winner = null;

function createEmptyBoard() {
  return Array.from({ length: boardSize }, () => Array(boardSize).fill(null));
}

function updateStatus(message) {
  statusElement.textContent = message;
}

function renderBoard() {
  boardElement.innerHTML = "";

  for (let row = 0; row < boardSize; row += 1) {
    for (let col = 0; col < boardSize; col += 1) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "cell";
      cell.setAttribute("aria-label", `Row ${row + 1}, Column ${col + 1}`);

      if (board[row][col]) {
        cell.classList.add("occupied");
        const piece = document.createElement("span");
        piece.className = `piece ${board[row][col]}`;
        cell.appendChild(piece);
      }

      cell.addEventListener("click", () => handleMove(row, col));
      boardElement.appendChild(cell);
    }
  }
}

function countDirection(row, col, rowStep, colStep, player) {
  let count = 0;
  let nextRow = row + rowStep;
  let nextCol = col + colStep;

  while (
    nextRow >= 0 &&
    nextRow < boardSize &&
    nextCol >= 0 &&
    nextCol < boardSize &&
    board[nextRow][nextCol] === player
  ) {
    count += 1;
    nextRow += rowStep;
    nextCol += colStep;
  }

  return count;
}

function isWinningMove(row, col, player) {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  return directions.some(([rowStep, colStep]) => {
    const total =
      1 +
      countDirection(row, col, rowStep, colStep, player) +
      countDirection(row, col, -rowStep, -colStep, player);

    return total >= 5;
  });
}

function isBoardFull() {
  return board.every((row) => row.every((cell) => cell !== null));
}

function handleMove(row, col) {
  if (winner || board[row][col]) {
    return;
  }

  board[row][col] = currentPlayer;

  if (isWinningMove(row, col, currentPlayer)) {
    winner = currentPlayer;
    renderBoard();
    updateStatus(`${capitalize(currentPlayer)} wins`);
    return;
  }

  if (isBoardFull()) {
    renderBoard();
    updateStatus("Draw");
    return;
  }

  currentPlayer = currentPlayer === "black" ? "white" : "black";
  renderBoard();
  updateStatus(`${capitalize(currentPlayer)} to move`);
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function resetGame() {
  board = createEmptyBoard();
  currentPlayer = "black";
  winner = null;
  renderBoard();
  updateStatus("Black to move");
}

restartButton.addEventListener("click", resetGame);

resetGame();
