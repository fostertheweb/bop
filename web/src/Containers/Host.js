import React, { useEffect, useState, useCallback, useReducer } from "react";
import { stringify as stringifyQueryString } from "query-string";
import useAccessStorage from "../hooks/useAccessStorage";
import Search from "../Components/Search";
import Queue from "../Components/Queue";
import { QueueContext } from "../context/QueueContext";
import Player from "./Player";
import Devices from "../Components/Devices";
import { DeviceContext } from "../context/DeviceContext";
import { PlayerProvider } from "../hooks/useSpotifyPlayer";

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

export default function() {
  const { getAccessKeys, updateAccessToken } = useAccessStorage();
  const { access_token, refresh_token, error } = JSON.parse(getAccessKeys());
  const [accessToken, setAccessToken] = useState(access_token);
  const [queue, dispatch] = useReducer(queueReducer, []);
  const [deviceId, setDeviceId] = useState("");
  const refreshAccessToken = useCallback(async () => {
    const response = await fetch(
      "http://localhost:4000/refresh?" + stringifyQueryString({ refresh_token }),
      {
        method: "GET",
      },
    );
    const { access_token } = await response.json();
    setAccessToken(access_token);
  }, [refresh_token]);

  useEffect(() => {
    // TODO see if this works as expected
    if (access_token !== accessToken) {
      console.log("updating accessToken in local storage");

      updateAccessToken(accessToken);
    }
  }, [accessToken, updateAccessToken, access_token]);

  if (error) {
    return <div>there was an error</div>;
  }

  return (
    <>
      <PlayerProvider>
        <QueueContext.Provider value={queue}>
          <DeviceContext.Provider value={deviceId}>
            <div className="flex">
              <div className="flex-grow">
                <div className="flex items-start">
                  <div className="w-1/2 border-r border-gray-300 h-screen overflow-y-scroll">
                    <Queue dispatch={dispatch} />
                  </div>
                  <div className="w-1/2 h-screen overflow-y-scroll">
                    <Search dispatch={dispatch} />
                  </div>
                </div>
              </div>
              <div className="fixed bottom-0 left-0 flex items-center justify-between w-full p-4 bg-gray-200 border-t border-indigo-300 shadow-inner">
                <Player />
                <Devices
                  refreshAccessToken={refreshAccessToken}
                  access_token={accessToken}
                  onDeviceChange={setDeviceId}
                />
              </div>
            </div>
          </DeviceContext.Provider>
        </QueueContext.Provider>
      </PlayerProvider>
    </>
  );
}
