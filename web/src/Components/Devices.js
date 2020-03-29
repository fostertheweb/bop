import React, { useEffect, useState } from "react";
import { stringify as stringifyQueryString } from "query-string";

const tracks = ["spotify:track:20rCuKaiC6KaA2jQQqCSqV", "spotify:track:2aJDlirz6v2a4HREki98cP"];

export default function({ access_token, refreshAccessToken }) {
  const [devices, setDevices] = useState(null);
  const [loading, setLoading] = useState(false);

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
        console.log("there was an error, lets refresh");
        refreshAccessToken();
      }

      setLoading(false);
      setDevices(devices);
    }
    getDevices();
  }, [access_token, refreshAccessToken]);

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

  if (loading) {
    return <div>Loading</div>;
  }
  return (
    <div className="">
      {devices && devices.length ? (
        <DeviceSelector options={devices} />
      ) : (
        <div className="text-gray-700 bg-gray-400 p-4 rounded">No devices found.</div>
      )}
    </div>
  );
}

const TYPES = {
  Computer: "💻",
  TV: "📺",
  Smartphone: "📱",
  Unknown: "🔊",
};

function DeviceSelector(props) {
  return (
    <select className="appearance-none bg-gray-800 border-2 border-gray-700 px-4 py-2 rounded text-white focus:outline-none focus:shadow-outline">
      {props.options.map(device => (
        <option value={device.id} className="px-4 py-2">
          {(TYPES[device.type] || TYPES.Unknown) + " " + device.name}
        </option>
      ))}
    </select>
  );
}
