import { Poppins, Rubik_Bubbles, Rubik_Burned } from "next/font/google";
import React from "react";
const bubble = Poppins({ subsets: ["latin"], weight: "400" });

export default function CheckBoard({
  board,
  handleClick,
  role,
  turn,
  winningLine,
}: {
  board: string[];
  handleClick: (index: number) => void;
  role: string;
  turn: string;
  winningLine: number[] | null;
}) {
  return (
    <div
      className={`${bubble.className} 
        bg-[#282828] p-4 rounded-xl text-4xl text-white font-extrabold text-stroke-3 relative
      `}
    >
      <div className="board">
        {board.map((value, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className="btn btn-outline cell text-stroke-3"
            // disabled={role !== turn}
          >
            {value}
          </button>
        ))}
      </div>

      {/* Draw winning line */}
      {winningLine && (
        <svg className="winning-line" viewBox="0 0 300 300">
          <line
            x1={50 + 100 * (winningLine[0] % 3)}
            y1={50 + 100 * Math.floor(winningLine[0] / 3)}
            x2={50 + 100 * (winningLine[2] % 3)}
            y2={50 + 100 * Math.floor(winningLine[2] / 3)}
            stroke="red"
            strokeWidth="5"
          />
        </svg>
      )}

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
          text-align: center;
          line-height: 100px;
          cursor: pointer;
        }

        .winning-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
