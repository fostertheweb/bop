import React, { useEffect, useState, useReducer } from "react";
import Search from "../Components/Search";
import Queue from "../Components/Queue";
import { QueueContext } from "../context/QueueContext";
import Devices from "../Components/Devices";
import { DeviceContext } from "../context/DeviceContext";
import User from "../Components/User";
import { useAccessStorage } from "../hooks/useAccessStorage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListMusic, faSearch, faCog } from "@fortawesome/pro-duotone-svg-icons";

import io from "socket.io-client";
import NowPlaying from "../Components/NowPlaying";

const socket = io(`http://localhost:4000`);

function queueReducer(state, { type, payload }) {
  switch (type) {
    case "addToQueue":
      return [...state, payload];
    case "removeFromQueue":
      return [...payload];
    default:
      throw new Error();
  }
}

export default function Host() {
  const { tokens, error } = useAccessStorage();
  const [queue, dispatch] = useReducer(queueReducer, []);
  const [deviceId, setDeviceId] = useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
    // TODO maybe move this?
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
      dispatch({ type: "addToQueue", payload });
    });
  }, []);

  useEffect(() => {
    socket.emit("queueUpdated", { room: user.id, payload: queue });
  }, [queue, user.id]);

  if (error) {
    return <div>there was an error</div>;
  }

  return (
    <>
      <QueueContext.Provider value={queue}>
        <DeviceContext.Provider value={deviceId}>
          <NowPlaying setDeviceId={setDeviceId} />
          <div className="flex bg-gray-800 max-h-screen" style={{ paddingTop: "120px" }}>
            <div className="bg-gray-900 px-2 flex flex-col">
              <div className="text-center p-2 rounded text-teal-300 font-medium cursor-pointer">
                <FontAwesomeIcon icon={faSearch} size="lg" className="fill-current" />
                <div className="mt-1 text-sm">Search</div>
              </div>
              <div className="mt-2 text-center p-2 rounded text-gray-500">
                <FontAwesomeIcon icon={faListMusic} size="lg" className="fill-current" />
                <div className="mt-1 text-sm">Playlists</div>
              </div>
              <div className="mt-2 text-center p-2 rounded text-gray-500">
                <FontAwesomeIcon icon={faCog} size="lg" className="fill-current" />
                <div className="mt-1 text-sm">Settings</div>
              </div>
              <div className="flex-grow">&nbsp;</div>
              <User user={user} />
            </div>
            <div className="w-1/2">
              <Search dispatch={dispatch} />
            </div>
            <div className="flex-grow">
              <Queue dispatch={dispatch} />
            </div>
          </div>
        </DeviceContext.Provider>
      </QueueContext.Provider>
    </>
  );
}
