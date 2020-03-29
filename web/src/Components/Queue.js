import React, { useContext, useEffect } from "react";
import { QueueContext } from "../context/QueueContext";

export default function({ dispatch }) {
  const queue = useContext(QueueContext);

  useEffect(() => {
    console.log(queue);
  }, [queue]);

  return (
    <div className="border-l border-gray-300 pl-4 h-full">
      <h1 className="text-lg text-gray-600 tracking-wide py-2">Play Queue</h1>
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
