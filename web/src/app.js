import React from "react";
import { Routes, Route } from "react-router-dom";
import Start from "containers/start";
import Login from "containers/login";
import { Room } from "containers/room";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "react-query";
import { PersistenceObserver, initializeState } from "./store";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot initializeState={initializeState}>
        <PersistenceObserver />
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="login" element={<Login />} />
          <Route path="rooms/:id/*" element={<Room />} />
        </Routes>
      </RecoilRoot>
    </QueryClientProvider>
  );
}

export default App;
