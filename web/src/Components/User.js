import React from "react";

export default function User({ user }) {
  return <div className="font-medium text-gray-400 mx-2">{user.display_name}</div>;
}
