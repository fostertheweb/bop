import React from "react";
import { Routes, Route } from "react-router-dom";
import Start from "containers/start";
import Login from "containers/login";
import Host from "containers/host";
import { Room } from "containers/room";
import Join from "containers/join";
import { RecoilRoot } from "recoil";
import { PersistenceObserver, initializeState } from "./store";
import useDarkMode from "hooks/use-dark-mode";

function App() {
  const { ThemeProvider } = useDarkMode();
  return (
    <RecoilRoot initializeState={initializeState}>
      <ThemeProvider />
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
