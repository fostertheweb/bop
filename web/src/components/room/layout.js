import React from "react";
import { Outlet } from "react-router";
import Queue from "components/room/queue";
import Player from "components/room/player";
import Sidebar from "components/room/sidebar";

export default function Layout() {
  return (
    <>
      <div className="flex h-content overflow-hidden">
        <Sidebar />
        <div className="w-1/2 overflow-y-scroll hide-native-scrollbar">
          <Outlet />
        </div>
        <div className="flex-grow overflow-y-scroll hide-native-scrollbar bg-gray-200">
          <Queue />
        </div>
      </div>
      <Player />
    </>
  );
}
