import React from "react";
import { Routes, Route } from "react-router-dom";
import Search from "components/host/search";
import Playlists from "components/Playlists";
import Settings from "components/host/settings";
import Playlist from "components/Playlist";
import ListenersList from "components/host/listeners";
import Layout from "components/host/layout";

export function Room() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="search" element={<Search />} />
        <Route path="playlists" element={<Playlists />} />
        <Route path="playlists/:playlistId" element={<Playlist />} />
        <Route path="listeners" element={<ListenersList />} />
        <Route path="requests" element={<div>Requests</div>} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
