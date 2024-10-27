import React, { useState } from "react";

export default function RoomIdInputModal({
  setRoomId,
}: {
  setRoomId: (roomId: string) => void;
}) {
  const [input, setInput] = useState("");
  return (
    <div>
      <dialog id="room-id-input-modal" className="modal">
        <div className="modal-box">
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="text"
              className="grow"
              onChange={(e) => {
                setInput(e.target.value);
              }}
              placeholder="Search"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fill-rule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clip-rule="evenodd"
              />
            </svg>
          </label>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
              <button className="btn btn-primary ml-4" onClick={() => setRoomId(input)}>
                Join Room
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
