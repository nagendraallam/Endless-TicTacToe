"use client";

import { useEffect, useState } from "react";
import { socket } from "./socket";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  const [username, setUsername] = useState("N/A");
  const [role, setRole] = useState("N/A");

  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setServerTurn] = useState("");

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
        setServerTurn(currentTurn);
      });

      // Listen for board updates
      socket.on("boardUpdate", (updatedBoard) => {
        setBoard(updatedBoard);
        console.log("Board updated:", updatedBoard);
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
    socket.emit("makeMove", index);
  };

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      <p>username : {username}</p>
      <p>role : {role}</p>
      <div>
        <h2>Tic Tac Toe</h2>
        <div className="board">
          {board.map((value, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className="cell"
              disabled={role !== turn}
            >
              {value}
            </button>
          ))}
        </div>

        {/* Show whose turn it is */}

        <style jsx>{`
          .board {
            display: grid;
            grid-template-columns: repeat(3, 100px);
            grid-template-rows: repeat(3, 100px);
            gap: 10px;
          }

          .cell {
            width: 100px;
            height: 100px;
            font-size: 2em;
            color: black;
            text-align: center;
            line-height: 100px;
            cursor: pointer;
            background-color: #f0f0f0;
            border: 2px solid #333;
          }
        `}</style>
      </div>
    </div>
  );
}
