import useAccessStorage from "./useAccessStorage";
import { useCallback, useState, useRef, useEffect } from "react";

const noop = () => {};

export function useSpotifyWebPlayback(props = {}) {
  const accountError = props.accountError || noop;
  const onReady = props.onReady || noop;
  const onPlayerStateChanged = props.onPlayerStateChanged || noop;
  const { getAccessKeys } = useAccessStorage();
  const { access_token } = JSON.parse(getAccessKeys());
  const [isReady, setIsReady] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const playerRef = useRef(null);

  useEffect(() => {
    if (window.Spotify) {
      //eslint-disable-next-line
      playerRef.current = new Spotify.Player({
        name: "bop",
        getOAuthToken: callback => {
          callback(access_token);
        },
      });
      setIsReady(true);
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      //eslint-disable-next-line
      playerRef.current = new Spotify.Player({
        name: "bop",
        getOAuthToken: callback => {
          callback(access_token);
        },
      });
      setIsReady(true);
    };

    if (!window.Spotify) {
      const scriptTag = document.createElement("script");
      scriptTag.src = "https://sdk.scdn.co/spotify-player.js";

      document.head.appendChild(scriptTag);
    }
    //eslint-disable-next-line
  }, []);

  const handleReady = useCallback(({ device_id: readyDeviceId }) => {
    setDeviceId(readyDeviceId);

    if (onReady) {
      onReady(deviceId);
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isReady) {
      playerRef.current.connect();
    }
  }, [isReady]);

  useEffect(() => {
    const player = playerRef.current;
    if (isReady) {
      player.addListener("account_error", accountError);
      player.addListener("ready", handleReady);
      player.addListener("initialization_error", accountError);
      player.addListener("authentication_error", accountError);
      player.addListener("not_ready", accountError);
      player.addListener("player_state_changed", onPlayerStateChanged);

      return () => {
        player.removeListener("account_error", accountError);
        player.removeListener("ready", handleReady);
        player.removeListener("player_state_changed", onPlayerStateChanged);
      };
    }

    return;
    //eslint-disable-next-line
  }, [isReady, onPlayerStateChanged]);

  return {
    player: playerRef.current,
    deviceId,
    isReady,
  };
}
