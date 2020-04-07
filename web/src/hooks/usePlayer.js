import React, { useState, useContext } from "react";
import { useAccessStorage } from "../hooks/useAccessStorage";
import { DeviceContext } from "../context/DeviceContext";
import { PlayerContext } from "../context/PlayerContext";
import { stringify as stringifyQueryString } from "query-string";

export const PlayerProvider = ({ children }) => {
  const player = usePlayerProvider();

  return <PlayerContext.Provider value={player}>{children}</PlayerContext.Provider>;
};

export const usePlayer = () => {
  return useContext(PlayerContext);
};

function usePlayerProvider() {
  const device_id = useContext(DeviceContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const { tokens } = useAccessStorage();

  const playPause = async uris => {
    await fetch(
      `https://api.spotify.com/v1/me/player/${isPlaying ? "pause" : "play"}?` +
        stringifyQueryString({ device_id }),
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
        body: uris ? JSON.stringify({ uris: [uris] }) : null,
      },
    );
    setIsPlaying(!isPlaying);
  };

  const skipPlayback = direction => {
    fetch(`https://api.spotify.com/v1/me/player/${direction}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
  };

  return { isPlaying, playPause, skipPlayback };
}
