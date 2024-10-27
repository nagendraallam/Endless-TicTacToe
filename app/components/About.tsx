import React from "react";

export default function AboutModal() {
  return (
    <div>
      <dialog id="about-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">About Forever Tic-Tac-Toe</h3>
          <p className="mb-4">
            Welcome to Forever Tic-Tac-Toe, a unique twist on the classic game
            that adds an exciting new dimension!
          </p>
          <p className="mb-4">
            In this version, players can join online rooms to compete against
            each other. The key difference is that only 3 moves are allowed on
            the board at any time. When a player makes their fourth move, the
            oldest move is automatically removed.
          </p>
          <p className="mb-4">
            This mechanic ensures that there can never be a draw, and someone
            must eventually win. The challenge comes from remembering your moves
            and your opponent&apos;s, as the board constantly changes. It adds an
            element of chance and strategy, as players might forget previous
            moves and have to adapt quickly.
          </p>
          <p className="mb-4">
            Join a room, challenge your friends, and experience this innovative
            take on Tic-Tac-Toe that combines memory, strategy, and a bit of
            luck!
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-outline mr-2">Close</button>
            </form>
            <a
              href="https://github.com/nagendraallam"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              View Other Projects
            </a>
          </div>
        </div>
      </dialog>
    </div>
  );
}
