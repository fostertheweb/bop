import React, { useState, useContext, createContext, useEffect } from "react";
import { useSpotify } from "./useSpotify";
import { DeviceContext } from "./useDevices";
import { stringify as stringifyQueryString } from "query-string";

export const PlayerContext = createContext(false);

export const PlayerProvider = ({ children }) => {
  const player = usePlayerProvider();

  return <PlayerContext.Provider value={player}>{children}</PlayerContext.Provider>;
};

export const usePlayer = () => {
  return useContext(PlayerContext);
};

function usePlayerProvider() {
  const { currentDevice } = useContext(DeviceContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayback, setCurrentPlayback] = useState(null);
  const { userCredentials } = useSpotify();

  useEffect(() => {
    async function getCurrentPlayback() {
      const response = await fetch("https://api.spotify.com/v1/me/player", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userCredentials.access_token}`,
        },
      });

      try {
        const { is_playing, item } = await response.json();
        setIsPlaying(is_playing);
        setCurrentPlayback(item);
      } catch (err) {
        console.log("error", err);
      }
    }
    getCurrentPlayback();
  }, [userCredentials.access_token]);

  async function playOrPause(uris) {
    if (currentDevice) {
      await fetch(
        `https://api.spotify.com/v1/me/player/${isPlaying ? "pause" : "play"}?` +
          stringifyQueryString({ device_id: currentDevice.id }),
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${userCredentials.access_token}`,
          },
          body: uris ? JSON.stringify({ uris: [uris] }) : null,
        },
      );
      setIsPlaying(!isPlaying);
    }
  }

  async function skipPlayback(direction) {
    await fetch(`https://api.spotify.com/v1/me/player/${direction}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${userCredentials.access_token}` },
    });
  }

  return { isPlaying, playOrPause, skipPlayback, currentPlayback };
}