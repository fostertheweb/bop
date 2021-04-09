import React from "react";
import { Routes, Route } from "react-router-dom";
import Search from "components/room/search";
import Playlists from "components/playlists";
import Layout from "components/room/layout";
import LoginModal from "components/spotify/login-modal";
import { useParams } from "react-router";
import { useRoom } from "hooks/use-rooms";

function Info() {
  const { id } = useParams();
  const { data: room, status } = useRoom(id);

  if (status === "loading") {
    return "Loading...";
  }

  return (
    <div className="p-2 text-gray-700">
      <div className="tracking-wide text-gray-500 small-caps">
        Listening with
      </div>
      <div className="text-xl font-medium">{room.name}</div>
      <div className="h-4"></div>
      <div className="tracking-wide text-gray-500 small-caps">Hosted by</div>
      <div className="text-lg font-medium">{room.host.username}</div>
    </div>
  );
}

export function Room() {
  return (
    <>
      <LoginModal show={true} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Info />} />
          <Route path="search" element={<Search />} />
          <Route path="playlists" element={<Playlists />} />
        </Route>
      </Routes>
    </>
  );
}
