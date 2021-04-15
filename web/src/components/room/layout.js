import React from "react";
import { Outlet } from "react-router";
import Queue from "components/room/queue";
import Player from "components/room/player";
import Sidebar from "components/room/sidebar";

export default function Layout() {
  return (
    <>
      <div className="flex overflow-hidden h-content">
        <Sidebar />
        <div className="w-1/2 overflow-y-scroll hide-native-scrollbar">
          <Outlet />
        </div>
        <div className="flex flex-col flex-grow overflow-y-scroll bg-gray-200 hide-native-scrollbar">
          <Queue />
        </div>
      </div>
      <Player />
    </>
  );
}
