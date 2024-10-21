function botMove(board, botRole, difficulty) {
  const opponentRole = botRole === "X" ? "O" : "X";

  // Find available moves (empty spots on the board)
  const availableMoves = board
    .map((cell, index) => (cell === null ? index : null))
    .filter((index) => index !== null);

  // Helper function to check if a player is about to win
  function checkWinMove(board, role) {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] === role && board[b] === role && board[c] === null) {
        return c; // Winning move
      }
      if (board[a] === role && board[c] === role && board[b] === null) {
        return b; // Winning move
      }
      if (board[b] === role && board[c] === role && board[a] === null) {
        return a; // Winning move
      }
    }
    return null;
  }

  // Helper function to make a mistake
  function makeMistake() {
    const mistakeChance = Math.random() < (difficulty === 1 ? 0.5 : 0.25);
    return mistakeChance
      ? availableMoves[Math.floor(Math.random() * availableMoves.length)]
      : null;
  }

  // Main bot logic
  function chooseMove() {
    let move = null;

    // Check if bot can win
    move = checkWinMove(board, botRole);
    if (move !== null) return move;

    // Check if opponent can win (block them)
    move = checkWinMove(board, opponentRole);
    if (move !== null) return move;

    // If difficulty is low, make mistakes sometimes
    const mistakeMove = makeMistake();
    if (mistakeMove !== null) return mistakeMove;

    // If no mistakes, pick a random available move
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // Finally, choose and return a move based on difficulty and logic
  return chooseMove();
}

module.exports = botMove;
