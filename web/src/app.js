import React from "react";
import { Routes, Route } from "react-router-dom";
import Start from "containers/Start";
import Login from "containers/Login";
import Host from "containers/Host";
import { Room } from "containers/room";
import Join from "containers/Join";
import { RecoilRoot } from "recoil";
import { PersistenceObserver, initializeState } from "./store";

function App() {
  return (
    <RecoilRoot initializeState={initializeState}>
      <PersistenceObserver />
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="login" element={<Login />} />
        <Route path="host" element={<Host />} />
        <Route path="join/:id" element={<Join />} />
        <Route path="rooms/:id/*" element={<Room />} />
      </Routes>
    </RecoilRoot>
  );
}

export default App;
