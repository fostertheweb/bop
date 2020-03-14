import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { parse as parseQueryString, stringify as stringifyQueryString } from "query-string";

const TYPES = {
  Computer: "💻",
  TV: "📺",
  Smartphone: "📱",
  Unknown: "🔊",
};

const tracks = ["spotify:track:20rCuKaiC6KaA2jQQqCSqV", "spotify:track:2aJDlirz6v2a4HREki98cP"];

export default function() {
  const location = useLocation();
  const { access_token, refresh_token, error } = parseQueryString(location.search);

  const [devices, setDevices] = useState(null);
  const [accessToken, setAccessToken] = useState(access_token);

  useEffect(() => {
    async function getDevices() {
      const response = await fetch("https://api.spotify.com/v1/me/player/devices", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const _devices = await response.json();
      setDevices(_devices.devices);
    }
    getDevices();
  }, [accessToken]);

  const playJam = async device_id => {
    console.log(device_id);
    const addedToQueue = await fetch(
      "https://api.spotify.com/v1/me/player/play?" +
        stringifyQueryString({ uris: tracks, device_id }),
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    console.log(addedToQueue);
  };

  const refresh = async () => {
    const response = await fetch(
      "http://localhost:4000/refresh?" + stringifyQueryString({ refresh_token }),
      {
        method: "GET",
      },
    );

    const { access_token } = await response.json();
    setAccessToken(access_token);
  };
  if (error) {
    return <div>there was an error</div>;
  }
  return (
    <div>
      {devices ? (
        devices.map(device => (
          <div key={device.id}>
            {device.name} | {TYPES[device.type]} | {device.isActive ? "Active" : "Nope"}
            <button onClick={() => playJam(device.id)}>Play a jam</button>
          </div>
        ))
      ) : (
        <div> no devices found</div>
      )}
      <button onClick={refresh}>Refresh Token</button>
    </div>
  );
}
