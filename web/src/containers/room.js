import React from "react";
import { Routes, Route } from "react-router-dom";
import Search from "components/room/search";
import Playlists from "components/playlists";
import Layout from "components/room/layout";
import { useRoom } from "hooks/use-rooms";
// import Settings from "components/room/settings";

function Info() {
  const { data: room, status } = useRoom();

  if (status === "loading") {
    return "Loading...";
  }
  if (!room) return null;

  return (
    <div className="p-2 text-gray-800">
      <div className="tracking-wide text-gray-600 small-caps">
        Listening with
      </div>

      <div className="text-xl font-medium">{room.name}</div>
      <div className="h-4"></div>
      <div className="tracking-wide text-gray-600 small-caps">Hosted by</div>
      <div className="h-2"></div>
      <div className="flex items-center">
        <img
          src={room.host.avatar_url}
          width="36"
          height="36"
          alt="Host User Avatar"
          className="rounded shadow"
        />
        <div className="ml-2 text-lg font-medium">{room.host.username}</div>
      </div>

      {/* Share Link for Room */}
    </div>
  );
}

export function Room() {
  const { data: room } = useRoom();
  if (!room)
    return (
      <div class="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 h-screen flex justify-center items-center">
        <div className="w-1/3 h-1/3 bg-white rounded-md shadow-lg flex flex-col justify-center items-center">
          <span className="text-4xl">This room is no longer active 😵</span>
          <p className="text-xl p-1">
            📻 Create a new one in your Discord server
          </p>
        </div>
      </div>
    );
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Info />} />
          <Route path="search" element={<Search />} />
          <Route path="playlists" element={<Playlists />} />
          {/* <Route path="settings" element={<Settings />} /> */}
        </Route>
      </Routes>
    </>
  );
}
