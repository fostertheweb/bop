import React, { useEffect, useState, useCallback, useContext } from "react";
import { stringify as stringifyQueryString } from "query-string";
import useAccessStorage from "../hooks/useAccessStorage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStepBackward, faStepForward } from "@fortawesome/pro-duotone-svg-icons";
import { DeviceContext } from "../context/DeviceContext";

export default function() {
  const device_id = useContext(DeviceContext);
  const { getAccessKeys, updateAccessToken } = useAccessStorage();
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

  if (error) {
    return <div>there was an error</div>;
  }
  return (
    <div>
      <div className="flex items-center justify-between">
        <button className="text-gray-500 hover:text-gray-400">
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
        <button className="text-gray-500 hover:text-gray-400">
          <FontAwesomeIcon icon={faStepForward} size="2x" />
        </button>
      </div>
    </div>
  );
}
