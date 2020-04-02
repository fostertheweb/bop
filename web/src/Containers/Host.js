import React, { useEffect, useState, useReducer } from "react";
import Search from "../Components/Search";
import Queue from "../Components/Queue";
import { QueueContext } from "../context/QueueContext";
import Player from "./Player";
import Devices from "../Components/Devices";
import { DeviceContext } from "../context/DeviceContext";
import User from "../Components/User";
import { useAccessStorage } from "../hooks/useAccessStorage";

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
      setUser(me);
    };

    if (tokens.access_token) {
      getUserInfo();
    }
  }, [tokens]);

  if (error) {
    return <div>there was an error</div>;
  }

  return (
    <>
      <QueueContext.Provider value={queue}>
        <DeviceContext.Provider value={deviceId}>
          <div className="flex bg-gray-800">
            <div className="flex flex-col justify-between h-screen p-4 bg-gray-900 border-r-2 border-black text-gray-200">
              <Player />
              <User user={user} />
              <Devices onDeviceChange={setDeviceId} />
            </div>
            <div className="flex-grow">
              <div className="flex items-start">
                <div className="w-1/2 border-r border-black h-screen overflow-y-scroll hide-native-scrollbar">
                  <Queue dispatch={dispatch} />
                </div>
                <div className="w-1/2 h-screen overflow-y-scroll hide-native-scrollbar">
                  <Search dispatch={dispatch} />
                </div>
              </div>
            </div>
          </div>
        </DeviceContext.Provider>
      </QueueContext.Provider>
    </>
  );
}
