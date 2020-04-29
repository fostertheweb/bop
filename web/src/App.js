import React from "react";
import { Routes, Route } from "react-router-dom";
import { SpotifyProvider } from "./hooks/useSpotify";
import Landing from "./Containers/Landing";
import Login from "./Containers/Login";
import Host from "./Containers/Host";
import Join from "./Containers/Join";
import Listener from "./Containers/Listener";
import { PrivateRoute } from "./Components/PrivateRoute";

function App() {
  return (
    <SpotifyProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="login" element={<Login />} />
        <PrivateRoute path="host/*" element={<Host />} />
        <Route path="join" element={<Join />} />
        <Route path="listen/:room" element={<Listener />} />
      </Routes>
    </SpotifyProvider>
  );
}

export default App;
