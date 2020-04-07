import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faGamepadAlt,
  faMobile,
  faLaptop,
  faTv,
  faSpeaker,
  faTablet,
  faVolume,
  faSpinnerThird,
} from "@fortawesome/pro-duotone-svg-icons";
import { faChromecast, faUsb } from "@fortawesome/free-brands-svg-icons";
import { useAccessStorage } from "../hooks/useAccessStorage";

export default function Devices({ onDeviceChange }) {
  const [devices, setDevices] = useState(null);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(null);
  const { tokens } = useAccessStorage();

  useEffect(() => {
    async function getDevices() {
      setLoading(true);
      try {
        const response = await fetch("https://api.spotify.com/v1/me/player/devices", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        });
        const { devices } = await response.json();
        setDevices(devices);
        setCurrent(devices[0]);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    }

    if (tokens.access_token) {
      getDevices();
    }
    //eslint-disable-next-line
  }, [tokens.access_token]);

  if (loading) {
    return <FontAwesomeIcon icon={faSpinnerThird} spin className="fill-current" />;
  }

  return (
    <div className="">
      {devices && devices.length ? (
        <DeviceSelector
          current={current}
          options={devices}
          onChange={device => {
            onDeviceChange(device.id);
            setCurrent(device);
          }}
        />
      ) : (
        <div className="text-gray-700 bg-gray-400 p-4 rounded">No devices found.</div>
      )}
    </div>
  );
}

function DeviceSelector({ current, options, onChange }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    onChange(options[0]);
    //eslint-disable-next-line
  }, [options]);

  return (
    <div className="relative text-sm">
      <div
        onClick={() => setOpen(!open)}
        className={`px-4 py-2 whitespace-no-wrap text-left text-gray-400 cursor-pointer rounded border border-transparent hover:bg-gray-900 hover:border-gray-800`}>
        <FontAwesomeIcon
          icon={typeIcons[current.type] || faVolume}
          className="fill-current mr-2"
          size="lg"
        />{" "}
        {current.name}
      </div>
      <div
        className={`${
          open ? "block" : "hidden"
        } absolute top-0 right-0 flex flex-col bg-white rounded shadow z-10`}>
        {options.map(device => (
          <button
            key={device.id}
            onClick={() => {
              onChange(device);
              setOpen(false);
            }}
            className={`px-4 py-2 whitespace-no-wrap text-left text-gray-800 rounded hover:bg-gray-200`}>
            <FontAwesomeIcon
              icon={typeIcons[device.type]}
              className="fill-current mr-2"
              size="lg"
            />{" "}
            {device.name}
          </button>
        ))}
      </div>
    </div>
  );
}

const typeIcons = {
  Computer: faLaptop,
  TV: faTv,
  Smartphone: faMobile,
  Unknown: faVolume,
  Tablet: faTablet,
  Speaker: faSpeaker,
  AVR: faVolume,
  STB: faVolume,
  AudioDongle: faUsb,
  GameConsole: faGamepadAlt,
  CastVideo: faChromecast,
  CastAudio: faChromecast,
  Automobile: faCar,
};
