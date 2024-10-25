"use client";

import { useEffect, useState } from "react";
import { socket } from "./socket";
import CheckBoard from "./components/CheckBoard";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  const [username, setUsername] = useState("N/A");
  const [role, setRole] = useState("N/A");

  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setServerTurn] = useState("");

  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport: any) => {
        setTransport(transport.name);
      });

      socket.on("usernameAssigned", (assignedUsername) => {
        setUsername(assignedUsername);
        console.log("Username received from server:", assignedUsername);
      });

      socket.on("roleAssigned", (role) => {
        setRole(role);
        console.log("player is assigned role ", role);
      });

      socket.on("turn", (currentTurn) => {
        console.log("next turn", currentTurn);
        setServerTurn(currentTurn);
      });

      // Listen for board updates
      socket.on("boardUpdate", (updatedBoard) => {
        setBoard(updatedBoard);
        console.log("Board updated:", updatedBoard);
      });

      socket.on("roomJoined", (id) => {
        console.log(id);
        setRoomId(id);
      });

      socket.on("gameOver", ({ winner, board }) => {
        if (winner) {
          alert(`Player ${winner} has won!`);
        } else {
          alert("It's a tie!");
        }

        // Reset the board
        setBoard(board); // This will reset the board to the server's reset state
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const handleClick = (index: Number) => {
    if (role !== turn || board[index]) return; // Only allow the player to play on their turn

    // Send the move to the server
    socket.emit("makeMove", { index, roomId });
  };

  const handlePlay = () => {
    if (roomId) socket.emit("joinRoom", { roomId });
    else socket.emit("playRandom");
  };

  return (
    <div className="flex flex-col justify-center items-center h-[80%]">
      <div className="main-menu flex-col hidden">
        <button className="btn btn-outline btn-primary">Play!</button>
        <div className="flex flex-row mt-2">
          <button className="btn btn-outline mt-2 mr-2 btn-accent">
            Create Room
          </button>
          <button className="btn btn-outline mt-2 ml-2 btn-accent">
            Join a Room
          </button>
        </div>
        <button className="btn btn-outline mt-2 btn-secondary">About</button>
      </div>
      <div className="checkerboard">
        <div></div>
        <CheckBoard
          board={board}
          role={role}
          turn={turn}
          handleClick={handleClick}
        />
      </div>
    </div>
  );
}
