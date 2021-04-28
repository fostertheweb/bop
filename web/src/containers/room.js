import React from "react";
import { Routes, Route } from "react-router-dom";
import Search from "components/spotify/search";
import Playlists from "components/spotify/playlists";
import Layout from "components/room/layout";
import { useGetRoom } from "hooks/use-rooms";
import LikedSongs from "components/spotify/liked-songs";
import Info from "components/room/info";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/pro-duotone-svg-icons";
import { useDarkMode } from "hooks/use-dark-mode";
import Queue from "components/room/queue";

export function Room() {
  useDarkMode();
  const { data: room, status } = useGetRoom();

  if (room || status === "loading") {
    return (
      <>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Info />} />
            <Route path="queue" element={<Queue />} />
            <Route path="search" element={<Search />} />
            <Route path="playlists" element={<Playlists />} />
            <Route path="likes" element={<LikedSongs />} />
            {/* <Route path="settings" element={<Settings />} /> */}
          </Route>
        </Routes>
      </>
    );
  }

  return (
    <div class="bg-gradient-to-tr from-purple-400 via-pink-500 to-red-500 h-screen flex justify-center items-center">
      <div className="flex flex-col items-center justify-center w-1/3 bg-white rounded-md shadow-lg h-1/3">
        <div className="flex flex-col items-center justify-center flex-grow gap-4 text-gray-600">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            size="4x"
            className="text-gray-500 fill-current"
          />
          <h3 className="text-lg font-medium text-gray-700">
            Room is no longer active
          </h3>
          <ul className="flex flex-col gap-3 mt-4">
            <li>
              <FontAwesomeIcon icon={faDiscord} />
              <span className="ml-2">
                Create a new room from your Discord server
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
