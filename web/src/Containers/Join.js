import React, { useState } from "react";
import io from "socket.io-client";

export default function Join() {
  const [host, setHost] = useState("brendan_mcdonald");

  const joinRoom = () => {
    const socket = io("http://localhost:4000", {
      path: `/rooms/${host}`,
    });
    console.log({ socket });
  };

  return (
    <div className="flex flex-col justify-center h-screen w-full items-center">
      <input onChange={({ target }) => setHost(target.value)} value={host} />
      <button onClick={joinRoom}>join</button>
    </div>
  );
}
