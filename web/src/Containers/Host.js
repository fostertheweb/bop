import React, { useEffect, useState, useCallback } from "react";
import { stringify as stringifyQueryString } from "query-string";

const TYPES = {
  Computer: "💻",
  TV: "📺",
  Smartphone: "📱",
  Unknown: "🔊",
};

const tracks = ["spotify:track:20rCuKaiC6KaA2jQQqCSqV", "spotify:track:2aJDlirz6v2a4HREki98cP"];

export default function() {
  const { access_token, refresh_token, error } = JSON.parse(
    localStorage.getItem("bop:spotify:access"),
  );

  const [devices, setDevices] = useState(null);
  const [accessToken, setAccessToken] = useState(access_token);

  const refresh = useCallback(async () => {
    // const response = await fetch(
    //   "http://localhost:4000/refresh?" + stringifyQueryString({ refresh_token }),
    //   {
    //     method: "GET",
    //   },
    // );
    // const { access_token } = await response.json();
    // setAccessToken(access_token);
  }, [refresh_token]);

  useEffect(() => {
    async function getDevices() {
      const response = await fetch("https://api.spotify.com/v1/me/player/devices", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { error, devices } = await response.json();

      if (error) {
        refresh();
      } else {
        setDevices(devices);
      }
    }
    getDevices();
  }, [accessToken, refresh]);

  const playJam = async device_id => {
    console.log(device_id);
    const addedToQueue = await fetch(
      "https://api.spotify.com/v1/me/player/play?" + stringifyQueryString({ device_id }),
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ uris: tracks }),
      },
    );
    console.log(addedToQueue);
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
    </div>
  );
}
