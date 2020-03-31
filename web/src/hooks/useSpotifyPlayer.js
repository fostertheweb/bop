import React, { useState, useEffect, useContext, createContext } from "react";
import useAccessStorage from "./useAccessStorage";
import { useScript } from "./useScript";

const PlayerContext = createContext({});

export function PlayerProvider({ children }) {
  const player = usePlayerProvider();

  return <PlayerContext.Provider value={player}>{children}</PlayerContext.Provider>;
}

export const useSpotifyPlayer = () => {
  return useContext(PlayerContext);
};

export function usePlayerProvider() {
  const [loaded] = useScript("https://sdk.scdn.co/spotify-player.js");
  const [player, setPlayer] = useState({});
  const [loading, setLoading] = useState(false);
  const { getAccessKeys } = useAccessStorage();
  const { access_token } = JSON.parse(getAccessKeys());

  function waitForSpotify() {
    return new Promise(resolve => {
      if ("Spotify" in window) {
        resolve();
      } else {
        window.onSpotifyWebPlaybackSDKReady = () => {
          resolve();
        };
      }
    });
  }

  useEffect(() => {
    setLoading(true);
    let _player = {};

    async function initPlayer() {
      await waitForSpotify();

      if (loaded) {
        _player = new window.Spotify.Player({
          name: "bop",
          getOAuthToken(callback) {
            callback(access_token);
          },
        });

        window.onSpotifyWebPlaybackSDKReady = () => {
          // Error handling
          _player.addListener("initialization_error", ({ message }) => {
            console.error(message);
          });
          _player.addListener("authentication_error", ({ message }) => {
            console.error(message);
          });
          _player.addListener("account_error", ({ message }) => {
            console.error(message);
          });
          _player.addListener("playback_error", ({ message }) => {
            console.error(message);
          });

          // Playback status updates
          _player.addListener("player_state_changed", state => {
            console.log(state);
          });

          // Ready
          _player.addListener("ready", ({ device_id }) => {
            console.log("Ready with Device ID", device_id);
          });

          // Not Ready
          _player.addListener("not_ready", ({ device_id }) => {
            console.log("Device ID has gone offline", device_id);
          });

          // Connect to the player!
          _player.connect();
        };

        setPlayer(_player);
        setLoading(false);
      }

      return () => {
        _player.removeListener("ready");
        _player.removeListener("not_ready");
        _player.removeListener("player_state_changed");
        _player.removeListener("playback_error");
        _player.removeListener("account_error");
        _player.removeListener("authentication_error");
        _player.removeListener("authentication_error");
        setPlayer(null);
      };
    }

    initPlayer();

    //eslint-disable-next-line
  }, [loaded]);

  return { player, loading };
}
