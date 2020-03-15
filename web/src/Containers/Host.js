import React, { useEffect, useState, useCallback, useReducer } from "react";
import { stringify as stringifyQueryString } from "query-string";
import Device from "../Components/Device";
import useAccessStorage from "../hooks/useAccessStorage";
import Search from "../Components/Search";
import Queue from "../Components/Queue";
import { QueueContext } from "../context/QueueContext";
import Devices from "../Components/Devices";

function queueReducer(state, { type, item }) {
  switch (type) {
    case "addToQueue":
      return [...state, item];
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
    console.log("beginning refresh");
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
    <div>
      <QueueContext.Provider value={queue}>
        <Search dispatch={dispatch} />
        <Devices refreshAccessToken={refreshAccessToken} access_token={accessToken} />
        <Queue />
      </QueueContext.Provider>
    </div>
  );
}
