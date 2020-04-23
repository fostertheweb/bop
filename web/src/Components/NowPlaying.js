import React, { useContext } from "react";
import Player from "../Containers/Player";
import { QueueContext } from "../context/QueueContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusicSlash, faVolume } from "@fortawesome/pro-duotone-svg-icons";
import Devices from "./Devices";

export default function NowPlaying({ setDeviceId }) {
  const [item] = useContext(QueueContext);

  return (
    <div
      className="p-2 bg-gray-900 fixed top-0 w-full flex items-center justify-between"
      style={{ height: "120px" }}>
      <div className="w-1/3">
        {item ? (
          <>
            <div className="px-2 text-gray-600 text-sm">Now Playing</div>
            <div key={item.id} className="text-left flex items-center w-full">
              <div className="p-2">
                <img
                  src={item.album.images[2].url}
                  width="64"
                  height="64"
                  alt="album art"
                  className="shadow"
                />
              </div>
              <div className="ml-2">
                <div className="text-gray-400">{item.name}</div>
                <div className="text-gray-500">
                  {item.artists.map(artist => artist.name).join(", ")}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="p-2 text-gray-600 flex items-center" style={{ height: "64px" }}>
            <FontAwesomeIcon icon={faMusicSlash} size="lg" className="fill-current mr-2" />
            Add songs to the Play Queue
          </div>
        )}
      </div>
      <div className="w-1/3">
        <Player />
      </div>
      <div className="w-1/3 flex items-center justify-between">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faVolume} size="lg" color="white" />
          <input type="range" className="ml-2" />
        </div>
        <Devices onDeviceChange={setDeviceId} />
      </div>
    </div>
  );
}
