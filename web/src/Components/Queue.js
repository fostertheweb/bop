import React, { useContext, useEffect } from "react";
import { QueueContext } from "../context/QueueContext";
import { DeviceContext } from "../context/DeviceContext";
import { useAccessStorage } from "../hooks/useAccessStorage";
import { stringify as stringifyQueryString } from "query-string";
import NowPlaying from "./NowPlaying";

export default function Queue({ dispatch }) {
  const queue = useContext(QueueContext);
  const device_id = useContext(DeviceContext);
  const { tokens } = useAccessStorage("QUEUE");

  useEffect(() => {
    const isFirstTrack = queue.length === 1;
    const trackToQueue = queue.slice(-1)[0]?.uri;

    if (isFirstTrack) {
      console.log(queue[0].uri);
      fetch("https://api.spotify.com/v1/me/player/play?" + stringifyQueryString({ device_id }), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
        body: JSON.stringify({ uris: [queue[0].uri] }),
      });
    } else if (trackToQueue) {
      fetch(`https://api.spotify.com/v1/me/player/queue?uri=${trackToQueue}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
    }
    //eslint-disable-next-line
  }, [queue, tokens]);

  return (
    <div>
      <NowPlaying />
      <>
        {queue?.map(item => (
          <div
            key={item.id}
            className="text-left p-2 flex items-center w-full border-t border-black">
            <div className="p-2">
              <img src={item.album.images[2].url} alt="album art" className="shadow w-10 h-10" />
            </div>
            <div className="ml-1">
              <div className="text-gray-400">{item.name}</div>
              <div className="text-gray-500">
                {item.artists.map(artist => artist.name).join(", ")}
              </div>
            </div>
          </div>
        ))}
      </>
    </div>
  );
}
