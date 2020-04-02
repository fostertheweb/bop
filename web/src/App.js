import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./Containers/Landing";
import Login from "./Containers/Login";
import Host from "./Containers/Host";
import { TokensProvider } from "./hooks/useAccessStorage";

function App() {
  return (
    <TokensProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="host" element={<Host />} />
      </Routes>
    </TokensProvider>
  );
}

export default App;
