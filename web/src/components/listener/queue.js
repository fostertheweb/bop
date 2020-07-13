import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListMusic } from "@fortawesome/pro-solid-svg-icons";
import { useRecoilValue } from "recoil";
import { playQueueAtom } from "hooks/use-queue";

export default function Queue() {
  const queue = useRecoilValue(playQueueAtom);

  return (
    <>
      <div className="pt-6 pb-4 pl-4 text-base text-gray-600">
        <FontAwesomeIcon icon={faListMusic} className="mr-2 fill-current" />
        <span className="border-b-2 border-transparent">Play Queue</span>
      </div>
      {queue?.map((item) => {
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
