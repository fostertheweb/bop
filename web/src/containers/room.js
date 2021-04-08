import React from "react";
import { Routes, Route } from "react-router-dom";
import Search from "components/room/search";
import Playlists from "components/playlists";
import Layout from "components/room/layout";
import LoginModal from "components/spotify/login-modal";

export function Room() {
  return (
    <>
      <LoginModal show={true} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="search" element={<Search />} />
          <Route path="playlists" element={<Playlists />} />
        </Route>
      </Routes>
    </>
  );
}
