import React from "react";
import { Routes, Route } from "react-router-dom";
import Start from "containers/start";
import Login from "containers/login";
import { Room } from "containers/room";
import { RecoilRoot } from "recoil";
import { PersistenceObserver, initializeState } from "./store";

function App() {
  return (
    <RecoilRoot initializeState={initializeState}>
      <PersistenceObserver />
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="login" element={<Login />} />
        <Route path="rooms/:id/*" element={<Room />} />
      </Routes>
    </RecoilRoot>
  );
}

export default App;
