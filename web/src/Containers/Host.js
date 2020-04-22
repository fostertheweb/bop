import React, { useEffect, useState, useReducer } from "react";
import Search from "../Components/Search";
import Queue from "../Components/Queue";
import { QueueContext } from "../context/QueueContext";
import Devices from "../Components/Devices";
import { DeviceContext } from "../context/DeviceContext";
import User from "../Components/User";
import { useAccessStorage } from "../hooks/useAccessStorage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListMusic } from "@fortawesome/pro-duotone-svg-icons";

import io from "socket.io-client";

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
          <header className="flex items-center justify-between bg-black p-1">
            <div className="tracking-wide text-gray-400 mx-2 font-medium">
              <FontAwesomeIcon
                icon={faListMusic}
                size="lg"
                className="text-pink-500 fill-current mr-2"
              />
              <User user={user} />
            </div>
            <Devices onDeviceChange={setDeviceId} />
          </header>
          <div className="flex bg-gray-800 h-full">
            <div className="flex-grow">
              <div className="flex items-stretch">
                <div className="w-1/2 border-r border-gray-700 h-full overflow-y-scroll hide-native-scrollbar">
                  <Queue dispatch={dispatch} />
                </div>
                <div className="w-1/2 h-full overflow-y-scroll hide-native-scrollbar">
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
