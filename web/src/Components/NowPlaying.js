import React, { useContext } from "react";
import Player from "../Containers/Player";
import { QueueContext } from "../context/QueueContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusicSlash } from "@fortawesome/pro-duotone-svg-icons";

export default function NowPlaying() {
  const [item] = useContext(QueueContext);

  return (
    <div className="p-2 bg-gray-900 sticky top-0 flex items-center justify-between">
      <div>
        <div className="px-2 text-gray-600">Now Playing</div>
        {item ? (
          <div key={item.id} className="text-left flex items-center w-full">
            <div className="p-2">
              <img src={item.album.images[2].url} alt="album art" className="shadow" />
            </div>
            <div className="ml-2">
              <div className="text-gray-400">{item.name}</div>
              <div className="text-gray-500">
                {item.artists.map(artist => artist.name).join(", ")}
              </div>
            </div>
          </div>
        ) : (
          <div className="px-2 py-4 text-gray-600">
            <FontAwesomeIcon icon={faMusicSlash} size="lg" className="fill-current mr-2" />
            Search and add songs to the queue
          </div>
        )}
      </div>
      <Player />
    </div>
  );
}
