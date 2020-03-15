import React, { useEffect, useState, useCallback, useReducer } from "react";
import { stringify as stringifyQueryString } from "query-string";
import Device from "../Components/Device";
import useAccessStorage from "../hooks/useAccessStorage";
import Search from "../Components/Search";
import Queue from "../Components/Queue";
import { QueueContext } from "../context/QueueContext";

const tracks = ["spotify:track:20rCuKaiC6KaA2jQQqCSqV", "spotify:track:2aJDlirz6v2a4HREki98cP"];

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

  const [devices, setDevices] = useState(null);
  const [loading, setLoading] = useState(false);
  const [getDevicesError, setGetDevicesError] = useState(null);
  const [queue, dispatch] = useReducer(queueReducer, []);

  const refresh = useCallback(async () => {
    const response = await fetch(
      "http://localhost:4000/refresh?" + stringifyQueryString({ refresh_token }),
      {
        method: "GET",
      },
    );
    const { access_token } = await response.json();
    updateAccessToken(access_token);
  }, [refresh_token, updateAccessToken]);

  useEffect(() => {
    async function getDevices() {
      setLoading(true);
      const response = await fetch("https://api.spotify.com/v1/me/player/devices", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const { devices, error } = await response.json();

      if (error) {
        setGetDevicesError(error);
      }

      setLoading(false);
      setDevices(devices);
    }
    getDevices();
  }, [access_token]);

  useEffect(() => {
    if (getDevicesError) {
      refresh();
    }
  }, [getDevicesError, refresh]);

  const playJam = async device_id => {
    console.log(device_id);
    const addedToQueue = await fetch(
      "https://api.spotify.com/v1/me/player/play?" + stringifyQueryString({ device_id }),
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ uris: tracks }),
      },
    );
    console.log(addedToQueue);
  };

  if (error) {
    return <div>there was an error</div>;
  }
  if (loading) {
    return <div>Loading</div>;
  }
  return (
    <div>
      <QueueContext.Provider value={queue}>
        <Search dispatch={dispatch} />
        {devices ? (
          devices.map(device => (
            <Device {...device} onClick={playJam} access_token={access_token} key={device.id} />
          ))
        ) : (
          <div> no devices found</div>
        )}
        <Queue />
      </QueueContext.Provider>
    </div>
  );
}
