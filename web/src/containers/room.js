import React from "react";
import { Routes, Route } from "react-router-dom";
import Search from "components/room/search";
import Playlists from "components/playlists";
import Layout from "components/room/layout";
import { useRoom } from "hooks/use-rooms";
import LikedSongs from "components/room/liked-songs";

function Info() {
  const { data: room, status } = useRoom();

  if (status === "loading") {
    return "Loading...";
  }

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
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Info />} />
          <Route path="search" element={<Search />} />
          <Route path="playlists" element={<Playlists />} />
          <Route path="likes" element={<LikedSongs />} />
          {/* <Route path="settings" element={<Settings />} /> */}
        </Route>
      </Routes>
    </>
  );
}
