import React from "react";
import { Link } from "react-router-dom";

export default function() {
  return (
    <div>
      <h1>Landing Page</h1>
      <Link to="login">Host a Party</Link>
      <Link to="join">Join a Party</Link>
    </div>
  );
}
