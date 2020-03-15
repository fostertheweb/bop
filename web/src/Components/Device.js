import React from "react";

const TYPES = {
  Computer: "💻",
  TV: "📺",
  Smartphone: "📱",
  Unknown: "🔊",
};

export default function({ id, isActive, name, type, volume_percent, onClick, access_token }) {
  return (
    <div>
      {name} | {TYPES[type]} | {isActive ? "Active" : "Nope"}
      <button onClick={() => onClick(id)}>Play a jam</button>
    </div>
  );
}
