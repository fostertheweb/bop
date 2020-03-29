import React, { useContext, useEffect } from "react";
import { QueueContext } from "../context/QueueContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListMusic } from "@fortawesome/pro-light-svg-icons";
import useAccessStorage from "../hooks/useAccessStorage";

export default function({ dispatch }) {
  const queue = useContext(QueueContext);
  const { getAccessKeys } = useAccessStorage();
  const { access_token } = JSON.parse(getAccessKeys());

  useEffect(() => {
    const trackToQueue = queue.slice(-1)[0]?.uri;

    if (trackToQueue) {
      fetch(`https://api.spotify.com/v1/me/player/queue?uri=${trackToQueue}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${access_token}` },
      });
    }
  }, [queue, access_token]);

  return (
    <div className="">
      <h1 className="flex items-center text-lg text-gray-600 tracking-wide sticky top-0 p-4 bg-white">
        <FontAwesomeIcon icon={faListMusic} size="lg" className="fill-current" />
        <span className="ml-4 py-2">Play Queue</span>
      </h1>
      <div className="">
        {queue?.map(item => (
          <div
            key={item.id}
            className="text-left py-2 flex items-center w-full border-t border-gray-200">
            <div className="p-2">
              <img src={item.album.images[2].url} alt="album art" className="shadow" />
            </div>
            <div className="ml-2">
              <div className="text-gray-800">{item.name}</div>
              <div className="text-gray-600">
                {item.artists.map(artist => artist.name).join(", ")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
