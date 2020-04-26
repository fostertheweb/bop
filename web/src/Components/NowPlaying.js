import React from "react";
import Player from "../Containers/Player";
import { useQueue } from "../hooks/useQueue";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusicSlash, faVolume } from "@fortawesome/pro-solid-svg-icons";
import Devices from "./Devices";

export default function NowPlaying() {
  const {
    queue: [item],
  } = useQueue();

  console.log({ firstQueueItem: item });

  return (
    <div
      className="bg-gray-1000 sticky top-0 w-full flex items-center justify-between border-t-2 border-gray-700 shadow z-50"
      style={{ height: "80px" }}>
      <div className="w-1/3">
        {item ? (
          <>
            <div key={item.id} className="text-left flex items-center w-full">
              <div className="pl-4">
                <img
                  src={item.album.images[1].url}
                  width="48"
                  height="48"
                  alt="album art"
                  className="shadow"
                />
              </div>
              <div className="pl-4">
                <div className="text-gray-400">{item.name}</div>
                <div className="text-gray-500">
                  {item.artists.map(artist => artist.name).join(", ")}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="pl-4 text-gray-600 flex items-center" style={{ height: "80px" }}>
            <FontAwesomeIcon icon={faMusicSlash} size="lg" className="fill-current mr-2" />
            Add songs to the Play Queue
          </div>
        )}
      </div>
      <div className="w-1/3">
        <Player />
      </div>
      <div className="w-1/3 flex items-center justify-end">
        <div className="flex items-center mr-6">
          <FontAwesomeIcon icon={faVolume} size="lg" color="white" />
          <input type="range" className="ml-2" />
        </div>
        <Devices />
      </div>
    </div>
  );
}
