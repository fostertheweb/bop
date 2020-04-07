import React from "react";

export default function User({ user }) {
  return (
    <div className="inline-block font-medium text-gray-400 mx-2">
      {user.display_name}'s party <span role="img">🎉</span>
    </div>
  );
}
