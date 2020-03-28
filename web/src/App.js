import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Landing from "./Containers/Landing";
import Login from "./Containers/Login";
import Host from "./Containers/Host";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="login" element={<Login />} />
      <Route path="host" element={<Host />} />
    </Routes>
  );
}

export default App;
