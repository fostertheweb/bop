import React, { useEffect, useState, useCallback, useContext } from "react";
import { stringify as stringifyQueryString } from "query-string";
import useAccessStorage from "../hooks/useAccessStorage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStepBackward, faStepForward } from "@fortawesome/pro-duotone-svg-icons";
import { DeviceContext } from "../context/DeviceContext";
import { useSpotifyWebPlayback } from "../hooks/useSpotifyWebPlayback";

export default function() {
  const device_id = useContext(DeviceContext);
  const { getAccessKeys } = useAccessStorage();
  const { access_token, error } = JSON.parse(getAccessKeys());
  const tracks = ["spotify:track:3ZO6UxR61HavlXuyohc14T", "spotify:track:1r1oITz34K73OEbz1ogvxk"];
  const playJam = async () => {
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

  const skipPlayback = direction => {
    fetch(`https://api.spotify.com/v1/me/player/${direction}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${access_token}` },
    });
  };

  if (error) {
    return <div>there was an error</div>;
  }

  const { player, isReady } = useSpotifyWebPlayback();

  useEffect(
    () => {
      if (isReady) {
        player.connect();
        console.log(player);
      }
    },
    //eslint-disable-next-line
    [isReady],
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          className="text-gray-500 hover:text-gray-400"
          onClick={() => skipPlayback("previous")}>
          <FontAwesomeIcon icon={faStepBackward} size="2x" />
        </button>
        <button className="text-indigo-600 px-4 hover:text-indigo-500" onClick={playJam}>
          <FontAwesomeIcon icon={faPlay} size="3x" />
        </button>
        {/* Current Song
        <div className="p-2">
          <div className="flex items-center">
            <div>
              <img src="" alt="album art" />
            </div>
            <div>
              <div className="text-gray-800">Song title</div>
              <div classname="text-gray-700">Artist</div>
            </div>
          </div>
        </div> */}
        {/* Next Song */}
        <button className="text-gray-500 hover:text-gray-400" onClick={() => skipPlayback("next")}>
          <FontAwesomeIcon icon={faStepForward} size="2x" />
        </button>
      </div>
    </div>
  );
}
