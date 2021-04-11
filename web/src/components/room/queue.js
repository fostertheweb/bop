import React from "react";
import { motion } from "framer-motion";
import { useQueue, usePlayQueue } from "hooks/use-queue";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListMusic } from "@fortawesome/pro-solid-svg-icons";
import { useGetPlayQueue } from "hooks/use-queue";

export default function Queue() {
  const { status: playQueueStatus } = useGetPlayQueue();
  const { remove, next } = useQueue();
  const queue = usePlayQueue();

  return (
    <>
      <div className="pt-4 pb-4 pl-4 mb-1 text-base text-gray-600">
        <FontAwesomeIcon icon={faListMusic} className="mr-2 fill-current" />
        <span className="border-b-2 border-transparent">Play Queue</span>
        <button onClick={() => next()}>Start</button>
      </div>
      {queue?.map((item, index) => {
        return (
          <motion.div
            key={item.id}
            onClick={() => remove(index)}
            className="flex items-center w-full px-3 py-2 text-left border-b border-gray-300 opacity-0 cursor-pointer hover:bg-gray-300"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 200 },
              opacity: { duration: 0.2 },
            }}>
            <div className="">
              <img
                src={item.album.images[2].url}
                alt="album art"
                className="w-12 h-12 shadow"
              />
            </div>
            <div className="w-3"></div>
            <div>
              <div className="text-gray-700">{item.name}</div>
              <div className="text-gray-600">
                {item.artists.map((artist) => artist.name).join(", ")}
              </div>
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
