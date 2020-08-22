import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Search from "components/room/search";
import Playlists from "components/playlists";
import Settings from "components/room/settings";
import Requests from "components/room/requests";
import Playlist from "components/playlist";
import Listeners from "components/room/listeners";
import Layout from "components/room/layout";
import { useRemoteQueue } from "hooks/use-remote-queue";

export function Room() {
  const { join } = useRemoteQueue();

  useEffect(() => {
    join();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="search" element={<Search />} />
        <Route path="playlists" element={<Playlists />} />
        <Route path="playlists/:playlistId" element={<Playlist />} />
        <Route path="listeners" element={<Listeners />} />
        <Route path="requests" element={<Requests />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
