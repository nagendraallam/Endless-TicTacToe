const { generateUsername } = require("unique-username-generator");
const checkWin = require("./Checker");
const botMove = require("./bot");

// TODO: Add a way to store the rooms in a database
let rooms = {}; // Store rooms with their players
let boardState = {}; // Store the board for each room
let lastMoves = {};

function createRoomId() {
  return Math.floor(1000 + Math.random() * 9000).toString(); // Generate a random 4-digit room ID
}

// Check every 10 seconds

module.exports = function (io) {

  setInterval(() => {
    console.log("set interval called");
    Object.keys(rooms).forEach((roomId) => {
      const room = rooms[roomId];

      // Check if there's only one player in the room
      if (room.players.length === 1 && room.players[0].role) {

        const botRole = room.players[0].role === "X" ? "O" : "X";
        if(botRole !== room.currentTurn){
          console.log('not bot turn yet')
          return;
        }
        console.log(`Bot added to room ${roomId} with role ${botRole}`);

        console.log(boardState[roomId]);

        const botMoveIndex = botMove(boardState[roomId], botRole, 3); // Assume difficulty 3 for now
        boardState[roomId][botMoveIndex] = botRole;
        rooms[roomId].currentTurn = room.players[0].role;

        console.log(boardState[roomId]);

        if (!lastMoves[roomId]) {
          lastMoves[roomId] = [];
        } else {
          if (lastMoves[roomId].length > 5) {
            let firstPlayed = lastMoves[roomId].shift();
            boardState[roomId][firstPlayed.index] = null;
          }
        }
        lastMoves[roomId].push({ role: botRole, index: botMoveIndex });

        // Emit the bot's move to the room
        io.to(roomId).emit("boardUpdate", boardState[roomId]);
        io.to(roomId).emit("turn", room.players[0].role); // Give turn back to the real player

        setTimeout(() => {
          if (checkWin(boardState[roomId], botRole)) {
            io.to(roomId).emit("gameOver", { winner: botRole, board: boardState[roomId] });
            delete boardState[roomId]; // Reset the board for a new game
            delete rooms[roomId]; // Reset players array if necessary
          } 
        }, 250);
      }
    });
  }, 2000);

  io.on("connection", (socket) => {
    socket.on("joinRoom", ({ roomId }) => {
      // Check if the room exists and has less than 2 players
      if (rooms[roomId] && rooms[roomId].players.length < 2) {
        joinRoom(socket, roomId);
      } else {
        socket.emit("roomFull", "This room is full or does not exist.");
      }
    });

    socket.on("playRandom", () => {
      // Try to join an existing room with space, or create a new one
      const openRoom = Object.keys(rooms).find(
        (roomId) => rooms[roomId].players.length < 2
      );

      if (openRoom) {
        joinRoom(socket, openRoom);
      } else {
        const newRoomId = createRoom();
        joinRoom(socket, newRoomId);
      }
    });

    function createRoom() {
      const roomId = createRoomId();
      rooms[roomId] = { players: [], currentTurn: "X" };
      boardState[roomId] = Array(9).fill(null); // Initialize an empty board for the room
      return roomId;
    }

    function joinRoom(socket, roomId) {
      const room = rooms[roomId];
      let role = room.players.length === 0 ? "X" : "O"; // Assign role based on the number of players
      const username = generateUsername();

      if (room.players.length === 1) {
        role = room.players[0].role === "X" ? "O" : "X";
      } else if (room.players.length >= 2) {
        console.log("player count exceed to join");
        return;
      }

      socket.join(roomId);
      socket.username = username;
      room.players.push({ id: socket.id, role, username });

      console.log(`User ${username} joined room ${roomId} as ${role}`);

      // Send room details to the client
      socket.emit("usernameAssigned", username);
      socket.emit("roleAssigned", role);
      socket.emit("roomJoined", roomId);
      socket.emit("turn", room.currentTurn);

      // Broadcast updated player list to the room
      io.to(roomId).emit("playersUpdate", room.players);

      // If the room has two players, start the game
      if (room.players.length === 2) {
        io.to(roomId).emit("boardUpdate", boardState[roomId]);
      }
    }

    // Listen for moves from the current player
    socket.on("makeMove", ({ index, roomId }) => {
      const room = rooms[roomId];
      const player = room.players.find((p) => p.id === socket.id);
      let currentTurn = room.currentTurn;

      if (!lastMoves[roomId]) {
        lastMoves[roomId] = [];
      } else {
        if (lastMoves[roomId].length > 5) {
          let firstPlayed = lastMoves[roomId].shift();
          boardState[roomId][firstPlayed.index] = null;
        }
      }
      lastMoves[roomId].push({ role: player.role, index });

      const board = boardState[roomId];

      if (player && player.role === currentTurn && !board[index]) {
        // Update the board with the player's move
        board[index] = currentTurn;

        // Check if the current player has won
        if (checkWin(board, currentTurn)) {
          io.to(roomId).emit("gameOver", { winner: currentTurn, board });
          delete boardState[roomId];// Reset the board for a new game
          delete rooms[roomId]; // Reset players array if necessary
        } else {
          io.to(roomId).emit("boardUpdate", board);
          room.currentTurn = currentTurn === "X" ? "O" : "X";
          io.to(roomId).emit("turn", room.currentTurn);
        }

      } else {
        socket.emit(
          "invalidMove",
          "It's not your turn or the cell is already taken."
        );
      }
    });

    socket.on("disconnect", () => {
      // Find and remove the player from their room
      let roomId;
      Object.keys(rooms).forEach((id) => {
        const room = rooms[id];
        const playerIndex = room.players.findIndex(
          (player) => player.id === socket.id
        );
        if (playerIndex !== -1) {
          roomId = id;
          room.players.splice(playerIndex, 1);
        }
      });

      // Notify remaining player if the opponent has left
      if (roomId && rooms[roomId].players.length === 1) {
        io.to(roomId).emit("opponentLeft", "Your opponent has left the game.");
      }

      console.log(`Player disconnected: ${socket.id}`);
    });
  });
};
