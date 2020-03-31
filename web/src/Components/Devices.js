import React, { useEffect, useState } from "react";

export default function({ access_token, refreshAccessToken, onDeviceChange }) {
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

  if (loading) {
    return <div>Loading</div>;
  }
  return (
    <div className="">
      {devices && devices.length ? (
        <DeviceSelector options={devices} onChange={onDeviceChange} />
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

function DeviceSelector({ options, onChange }) {
  useEffect(() => {
    onChange(options[0].id);
  }, [onChange, options]);
  return (
    <select
      onChange={e => onChange(e.target.value)}
      className="appearance-none bg-transparent border-2 border-gray-400 px-4 py-2 rounded text-gray-600 focus:outline-none focus:shadow-outline">
      {options.map(device => (
        <option value={device.id} className="px-4 py-2" key={device.id}>
          {(TYPES[device.type] || TYPES.Unknown) + " " + device.name}
        </option>
      ))}
    </select>
  );
}
