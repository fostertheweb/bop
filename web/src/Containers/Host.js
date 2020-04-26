import React, { useEffect, useState, useReducer } from "react";
import { NavLink, Outlet, Routes, Route } from "react-router-dom";
import Search from "../Components/Search";
import Queue from "../Components/Queue";
import { useQueue, QueueProvider } from "../hooks/useQueue";
import { DeviceProvider } from "../hooks/useDevices";
import { useAccessStorage } from "../hooks/useAccessStorage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListMusic, faSearch, faCog } from "@fortawesome/pro-duotone-svg-icons";
import Playlists from "../Components/Playlists";
import Settings from "../Components/Settings";

import io from "socket.io-client";
import NowPlaying from "../Components/NowPlaying";

const socket = io(`http://localhost:4000`);

export default function Host() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="search" element={<Search />} />
        <Route path="playlists" element={<Playlists />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  const { queue, send } = useQueue();
  const { tokens, error } = useAccessStorage();
  const [user, setUser] = useState({});

  useEffect(() => {
    // TODO: maybe move this? for sure will soon
    const getUserInfo = async () => {
      const response = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      const me = await response.json();
      const { id: room } = me;
      socket.emit("join", { room, user: room });
      setUser(me);
    };

    if (tokens.access_token) {
      getUserInfo();
    }
  }, [tokens]);

  useEffect(() => {
    socket.on("clap", payload => {
      console.log({ payload });
    });
    socket.on("joined", payload => {
      console.log({ payload });
    });

    socket.on("addToQueue", payload => {
      send({ type: "addToQueue", payload });
    });
  }, []);

  useEffect(() => {
    socket.emit("queueUpdated", { room: user.id, payload: queue });
  }, [queue, user.id]);

  if (error) {
    return <div>there was an error</div>;
  }

  return (
    <QueueProvider>
      <DeviceProvider>
        <NowPlaying />
        <div className="flex bg-gray-800 h-content overflow-hidden">
          <Sidebar />
          <div className="w-1/2 overflow-y-scroll">
            <Outlet />
          </div>
          <div className="flex-grow bg-gray-900 overflow-y-scroll">
            <Queue />
          </div>
        </div>
      </DeviceProvider>
    </QueueProvider>
  );
}

function SidebarLink({ path, icon, children }) {
  return (
    <NavLink
      to={path}
      className="text-gray-500 block mt-2 text-center p-2 rounded cursor-pointer hover:text-gray-200 transition ease-in-out duration-150"
      activeClassName="text-teal-300 font-medium">
      <FontAwesomeIcon icon={icon} size="lg" className="fill-current" />
      <div className="mt-1 text-sm">{children}</div>
    </NavLink>
  );
}

function Sidebar() {
  return (
    <div className="bg-gray-950 flex flex-col" style={{ width: "80px" }}>
      <SidebarLink path="search" icon={faSearch}>
        Search
      </SidebarLink>
      <SidebarLink path="playlists" icon={faListMusic}>
        Playlists
      </SidebarLink>
      <SidebarLink path="settings" icon={faCog}>
        Settings
      </SidebarLink>
    </div>
  );
}
