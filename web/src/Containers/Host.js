import React, { useEffect, useState, useCallback, useReducer } from "react";
import { stringify as stringifyQueryString } from "query-string";
import useAccessStorage from "../hooks/useAccessStorage";
import Search from "../Components/Search";
import Queue from "../Components/Queue";
import { QueueContext } from "../context/QueueContext";
import Devices from "../Components/Devices";

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
      <QueueContext.Provider value={queue}>
        <div className="flex">
          <div className="p-4 bg-gray-800 h-screen flex flex-col justify-between text-white">
            <Devices refreshAccessToken={refreshAccessToken} access_token={accessToken} />
            <div className="">Spotify Username</div>
          </div>
          <div className="pl-4 py-4 w-2/5">
            <Search dispatch={dispatch} />
          </div>
          <div className="p-4 w-2/5">
            <Queue dispatch={dispatch} />
          </div>
        </div>
      </QueueContext.Provider>
    </>
  );
}
