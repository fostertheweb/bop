import React from "react";
import { Outlet } from "react-router";
import TabBar from "components/room/tab-bar";
import Sidebar from "components/room/sidebar";
import Queue from "components/room/queue";
import Player from "components/player";
import Modal from "components/modal";

export default function Layout() {
  return (
    <>
      <Modal>
        The CrowdQ bot lost its connection the voice channel. We can try to
        reconnect the bot to your current voice channel.
      </Modal>
      <div className="flex h-screen overflow-hidden cq-layout-pb">
        <Sidebar />
        <div className="flex flex-col flex-grow w-full overflow-x-hidden overflow-y-scroll lg:w-1/2 dark:bg-gray-800">
          <Outlet />
        </div>
        <div className="flex-col flex-grow hidden w-1/2 overflow-y-scroll bg-gray-200 lg:flex dark:bg-gray-900">
          <Queue />
        </div>
      </div>
      <div className="fixed bottom-0 flex flex-col w-full">
        <Player />
        <TabBar />
      </div>
    </>
  );
}
