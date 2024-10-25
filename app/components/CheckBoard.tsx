import React from "react";

export default function CheckBoard({ board, handleClick, role, turn }) {
  return (
    <div className="bg-slate-600 p-4 rounded-xl">
      <div className="board">
        {board.map((value, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className="btn btn-primary btn-outline cell"
            // disabled={role !== turn}
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
        }
      `}</style>
    </div>
  );
}
