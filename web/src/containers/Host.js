import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useRecoilValueLoadable } from "recoil";
import Search from "components/host/search";
import Playlists from "components/Playlists";
import Settings from "components/host/settings";
import Playlist from "components/Playlist";
import { userDetailsSelector } from "atoms/user-details";
import ListenersList from "components/host/listeners";
import Layout from "components/host/layout";
import { useRemoteQueue } from "hooks/use-remote-queue";

export default function Host() {
  const { state, contents } = useRecoilValueLoadable(userDetailsSelector);
  const { createRoom } = useRemoteQueue();

  useEffect(() => {
    if (state === "hasValue" && contents) {
      createRoom();
    }
  }, [state, contents, createRoom]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="search" element={<Search />} />
        <Route path="playlists" element={<Playlists />} />
        <Route path="playlists/:playlistId" element={<Playlist />} />
        <Route path="listeners" element={<ListenersList />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
