const boxes = document.querySelectorAll(".box");
const resetBtn = document.getElementById("reset-btn");
const msg = document.getElementById("msg");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X"; // Human is X, AI is O


const winningCombos = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

// Human move
boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
      if (board[index] === "" && currentPlayer === "X") {
        
        makeMove(index, "X");
        if (!checkWinner(board) && !isBoardFull()) {

            setTimeout(() => {
                const bestMove = getBestMove();
                makeMove(bestMove, "O");
              }, 300);
              
        }
      }
    });
  });

  function makeMove(index, player) {
    board[index] = player;
    boxes[index].textContent = player;
    currentPlayer = player === "X" ? "O" : "X";
  
    const winner = checkWinner(board);
    if (winner) {
        msg.innerText = `${winner} wins!`;
        disableBoard();
    } else if (isBoardFull()) {
        msg.innerText = "It's a draw!";
    }
  }

  function checkWinner(bd) {
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (bd[a] && bd[a] === bd[b] && bd[b] === bd[c]) {
        return bd[a]; // 'X' or 'O'
      }
    }
    return null;
  }


function isBoardFull() {
    return board.every(cell => cell !== "");
  }
  

  function disableBoard() {
    boxes.forEach(box => {
      box.disabled = true;
    });
  }
  


resetBtn.addEventListener("click", () => {
  board = ["", "", "", "", "", "", "", "", ""];
  boxes.forEach(box => {
    box.textContent = "";
    box.disabled = false;
  });
  msg.innerText="";
  currentPlayer = "X";
});


  

function getBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let score = minimax(board, 0, false);
        board[i] = "";
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }

  function isFull(bd) {
    return bd.every(cell => cell !== "");
  }
  


  function minimax(bd, depth, isMaximizing) {
    const winner = checkWinner(bd);
    if (winner === "X") return -10 + depth;
    if (winner === "O") return 10 - depth;
    if (isFull(bd)) return 0;
  
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < bd.length; i++) {
        if (bd[i] === "") {
          bd[i] = "O";
          let score = minimax(bd, depth + 1, false);
          bd[i] = "";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < bd.length; i++) {
        if (bd[i] === "") {
          bd[i] = "X";
          let score = minimax(bd, depth + 1, true);
          bd[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }