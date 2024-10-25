"use client";

import { useEffect, useState } from "react";
import { socket } from "./socket";
import CheckBoard from "./components/CheckBoard";
import RoomIdInputModal from "./components/RoomIdInputModal";

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
      <RoomIdInputModal
        setRoomId={(roomId) => {
          setRoomId(roomId);
          handlePlay();
        }}
      />
      {roomId ? (
        <div className="checkerboard">
          <div className="flex flex-col items-center justify-center mb-4">
            <p>Room ID: {roomId}</p>
            <p>Player: {username}</p>
            <p>Role: {role}</p>
            <p>Turn: {turn}</p>
          </div>
          <CheckBoard
            board={board}
            role={role}
            turn={turn}
            handleClick={handleClick}
          />
        </div>
      ) : (
        <div className="main-menu flex-col">
          <div className="flex flex-row items-center mb-8 justify-center">
            <svg
              width="150"
              height="150"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fillRule="evenodd"
              clipRule="evenodd"
              className="inline-block fill-current"
            >
              <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
            </svg>
          </div>
          <button
            className="btn btn-square w-full btn-primary"
            onClick={handlePlay}
          >
            Play!
          </button>
          <div className="flex flex-row mt-2">
            <button
              className="btn btn-outline mt-2 mr-2 btn-accent"
              onClick={handlePlay}
            >
              Create Room
            </button>
            <button
              className="btn btn-outline mt-2 ml-2 btn-accent"
              onClick={() => {
                const modal = document.getElementById(
                  "room-id-input-modal"
                ) as HTMLDialogElement;
                if (modal) modal.showModal();
              }}
            >
              Join a Room
            </button>
          </div>
          <button className="btn btn-outline mt-2 w-full btn-secondary">
            About
          </button>
        </div>
      )}
    </div>
  );
}
