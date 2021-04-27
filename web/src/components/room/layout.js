import React from "react";
import { Outlet } from "react-router";
import Sidebar from "components/room/sidebar";
import Queue from "components/room/queue";
import Player from "components/player";

export default function Layout() {
  return (
    <>
      <div className="flex overflow-hidden h-content">
        <Sidebar />
        <div className="flex flex-col flex-grow w-1/2 overflow-x-hidden overflow-y-scroll dark:bg-gray-800">
          <Outlet />
        </div>
        <div className="flex flex-col flex-grow w-1/2 overflow-y-scroll bg-gray-200 dark:bg-gray-900">
          <Queue />
        </div>
      </div>
      <Player />
    </>
  );
}
