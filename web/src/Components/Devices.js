import React, { useState } from "react";
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
} from "@fortawesome/pro-duotone-svg-icons";
import { faChromecast, faUsb } from "@fortawesome/free-brands-svg-icons";
import { useDevices } from "../hooks/useDevices";

export default function Devices() {
  const [open, setOpen] = useState(false);
  const { currentDevice, setCurrentDevice, status, devices } = useDevices();

  return (
    <div className="pr-4">
      {status === "loading" ? (
        <b>loading...</b>
      ) : status === "success" && currentDevice ? (
        <div className="relative text-sm">
          <div
            onClick={() => setOpen(!open)}
            className={`px-4 py-2 whitespace-no-wrap text-left text-gray-400 cursor-pointer rounded border border-transparent hover:bg-gray-900 hover:border-gray-800`}>
            <FontAwesomeIcon
              icon={typeIcons[currentDevice.type] || faVolume}
              className="fill-current mr-2"
              size="lg"
            />{" "}
            {currentDevice.name}
          </div>
          <div
            className={`${
              open ? "block" : "hidden"
            } absolute top-0 right-0 flex flex-col bg-white rounded shadow z-10`}>
            {devices.map(device => (
              <button
                key={device.id}
                onClick={() => {
                  setCurrentDevice(device);
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
      ) : (
        <div className="text-gray-700 bg-gray-400 p-2 rounded">No devices found.</div>
      )}
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
