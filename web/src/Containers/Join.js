import React, { useState } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io(`http://localhost:4000`);

export default function Join() {
  const [room, setRoom] = useState("brendan_mcdonald");
  const [name, setName] = useState("coolDude12");
  const navigate = useNavigate();

  const joinRoom = () => {
    socket.emit("join", { room, user: name });
  };

  const clap = () => {
    socket.emit("clap", { room, user: name });
  };
  socket.on("joined", () => {
    navigate(`/listen/${room}`);
  });

  return (
    <div className="flex flex-col justify-center h-screen w-full items-center">
      <input onChange={({ target }) => setName(target.value)} value={name} />
      <input onChange={({ target }) => setRoom(target.value)} value={room} />
      <button onClick={joinRoom}>join</button>
      <button onClick={clap}>clap</button>
    </div>
  );
}
