import React, { useContext } from "react";
import { stringify as stringifyQueryString } from "query-string";
import { useAccessStorage } from "../hooks/useAccessStorage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStepBackward, faStepForward } from "@fortawesome/pro-duotone-svg-icons";
import { DeviceContext } from "../context/DeviceContext";

export default function Player() {
  const device_id = useContext(DeviceContext);
  const { tokens, error } = useAccessStorage();
  const tracks = ["spotify:track:3ZO6UxR61HavlXuyohc14T", "spotify:track:1r1oITz34K73OEbz1ogvxk"];
  const playJam = async () => {
    const addedToQueue = await fetch(
      "https://api.spotify.com/v1/me/player/play?" + stringifyQueryString({ device_id }),
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
        body: JSON.stringify({ uris: tracks }),
      },
    );
    console.log(addedToQueue);
  };

  const skipPlayback = direction => {
    fetch(`https://api.spotify.com/v1/me/player/${direction}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
  };

  if (error) {
    return <div>there was an error</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-around">
        <button
          className="text-gray-500 hover:text-gray-400"
          onClick={() => skipPlayback("previous")}>
          <FontAwesomeIcon icon={faStepBackward} size="2x" />
        </button>
        <button className="text-teal-500 px-4 hover:text-teal-400" onClick={playJam}>
          <FontAwesomeIcon icon={faPlay} size="3x" />
        </button>
        <button className="text-gray-500 hover:text-gray-400" onClick={() => skipPlayback("next")}>
          <FontAwesomeIcon icon={faStepForward} size="2x" />
        </button>
      </div>
    </div>
  );
}
