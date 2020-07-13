import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
// import { useQueue } from "hooks/use-queue";
import { useRecoilValueLoadable } from "recoil";
import Search from "components/host/search";
import Playlists from "components/Playlists";
import Settings from "components/host/settings";
import Playlist from "components/Playlist";
import { userDetailsSelector } from "atoms/user-details";
import ListenersList from "components/host/listeners";
import Layout from "components/host/layout";

// const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

export default function Host() {
  // const { queue } = useQueue();
  const { state, contents } = useRecoilValueLoadable(userDetailsSelector);

  useEffect(() => {
    if (state === "hasValue" && contents) {
      // POST /api/queue
    }
  }, [state, contents]);

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
