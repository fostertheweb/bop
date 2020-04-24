import React, { useContext, useEffect, useState } from "react";
import { useAccessStorage } from "./useAccessStorage";
import { useQuery } from "react-query";

export const DeviceContext = React.createContext("");

export function DeviceProvider({ children }) {
  const devices = useDevicesProvider();
  return <DeviceContext.Provider value={devices}>{children}</DeviceContext.Provider>;
}

export const useDevices = () => {
  return useContext(DeviceContext);
};

const DEVICE_STORAGE_KEY = "bop:device";

export function useDevicesProvider() {
  const { tokens } = useAccessStorage();
  const [currentDevice, setCurrentDevice] = useState(getStoredDevice());
  const { status, data } = useQuery("devices", [tokens.access_token], async () => {
    const response = await fetch("https://api.spotify.com/v1/me/player/devices", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });
    const { devices } = await response.json();
    return devices;
  });

  function getStoredDevice() {
    return JSON.parse(localStorage.getItem(DEVICE_STORAGE_KEY));
  }

  useEffect(() => {
    localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(currentDevice));
    // call spotify connect api change device
  }, [currentDevice]);

  useEffect(() => {
    // avoid a state without an active device
    if (status === "success" && currentDevice === null && data) {
      setCurrentDevice(data[0]);
    }
  }, [data, status, currentDevice]);

  return { status, currentDevice, setCurrentDevice, devices: data };
}

// Hook Returns
// ------------
// currentDevice
// setCurrentDevice
//   - persist selected device in local storage
//   - play music on selected device
