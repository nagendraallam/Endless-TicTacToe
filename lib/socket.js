const { generateUsername } = require("unique-username-generator");
const checkWin = require("./Checker");

let players = [];
let board = Array(9).fill(null); // Initial empty board
let recentMoves = []; // Track the last 3 moves
let currentTurn = "X"; // X starts the game

module.exports = function (io) {
  io.on("connection", (socket) => {
    if (players.length < 2) {
      const role = players.length === 0 ? "X" : "O"; // First player is 'X', second player is 'O'

      socket.username = generateUsername();

      players.push({ id: socket.id, role, username: socket.username });

      console.log(
        "user connected with username ",
        socket.username,
        " and role ",
        role
      );

      socket.emit("usernameAssigned", socket.username);
      socket.emit("roleAssigned", role);

      socket.emit("turn", currentTurn);
    }

    // Listen for moves from the current player
    socket.on("makeMove", (index) => {
      const player = players.find((p) => p.id === socket.id);

      // Ensure it's the correct player's turn and the board cell is empty
      if (player.role === currentTurn && !board[index]) {
        // Update the board with the player's move
        board[index] = currentTurn;
        recentMoves.push({ player, index });
        console.log(recentMoves.length);
        if (recentMoves.length > 6) {
          let lastPlayed = recentMoves.shift();
          board[lastPlayed.index] = null;
        }

        // Check if the current player has won
        if (checkWin(board, currentTurn)) {
          io.emit("gameOver", { winner: currentTurn, board });
          board = Array(9).fill(null); // Reset the board for a new game
          players = []; // Reset players array if necessary
          currentTurn = "X"; // Reset turn
        } else {
          // Broadcast the updated board to both players
          io.emit("boardUpdate", board);

          // Check if the board is full (tie game)
          if (board.every((cell) => cell)) {
            io.emit("gameOver", { winner: null, board }); // No winner, it's a tie
            board = Array(9).fill(null); // Reset board
            players = []; // Reset players
            currentTurn = "X"; // Reset turn
          } else {
            // Switch turns if the game is still ongoing
            currentTurn = currentTurn === "X" ? "O" : "X";
            io.emit("turn", currentTurn);
          }
        }
      } else {
        socket.emit(
          "invalidMove",
          "It's not your turn or the cell is already taken."
        );
      }
    });

    socket.on("disconnect", () => {
      // Remove the player from the players array
      players = players.filter((player) => player.id !== socket.id);
      console.log(`Player disconnected: ${socket.id}`);

      // Notify the other player that their opponent left
      if (players.length === 1) {
        io.to(players[0].id).emit(
          "opponentLeft",
          "Your opponent has left the game."
        );
      }
    });
  });
};
