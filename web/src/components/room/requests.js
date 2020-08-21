import React from "react";
import { useRemoteQueue } from "hooks/use-remote-queue";
import { useSongRequests, songRequestsState } from "hooks/use-song-requests";
import { motion } from "framer-motion";
import { useRecoilValue } from "recoil";

export default function Requests() {
  const { removeSongRequest } = useSongRequests();
  const { addToQueue } = useRemoteQueue();
  // TODO: useLoadable showe spinner when fetching the request list
  const requests = useRecoilValue(songRequestsState);

  return (
    <>
      <h1 className="p-4 text-gray-500 font-medium text-lg tracking-wide">
        Song Requests
      </h1>
      {requests?.map((item, index) => {
        return (
          <motion.div
            key={item.id}
            className="text-left p-2 flex items-center w-full opacity-0 cursor-pointer hover:bg-gray-800"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 200 },
              opacity: { duration: 0.2 },
            }}>
            <div className="p-2">
              <img
                src={item.album.images[2].url}
                alt="album art"
                className="shadow w-10 h-10"
              />
            </div>
            <div className="ml-1">
              <div className="text-gray-400">{item.name}</div>
              <div className="text-gray-500">
                {item.artists.map((artist) => artist.name).join(", ")}
              </div>
            </div>
            <div>
              <button onClick={() => addToQueue(item)}>Add to Queue</button>
              <button onClick={() => removeSongRequest(index)}>
                Remove Request
              </button>
            </div>
          </motion.div>
        );
      })}
    </>
  );
}

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
    };
  },
};
