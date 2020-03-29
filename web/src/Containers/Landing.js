import React from "react";
import { Link } from "react-router-dom";

export default function() {
  return (
    <div className="flex flex-col justify-center h-screen w-full items-center">
      <h1 className="text-xl tracking-wide text-gray-700 font-medium">bop</h1>
      <div className="mt-8">
        <Link
          to="login"
          className="text-base leading px-6 py-3 rounded-full bg-purple-500 text-white hover:bg-purple-600">
          Host a Party
        </Link>
        <Link
          to="join"
          className="ml-4 text-base leading px-6 py-3 rounded-full bg-indigo-500 text-white hover:bg-indigo-600">
          Join a Party
        </Link>
      </div>
    </div>
  );
}
