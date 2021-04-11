import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQueue, usePlayQueue } from "hooks/use-queue";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListMusic } from "@fortawesome/pro-solid-svg-icons";
import { useGetPlayQueue } from "hooks/use-queue";
import { useGetTrackById } from "hooks/use-tracks";
import { faStopwatch } from "@fortawesome/pro-duotone-svg-icons";

export default function Queue() {
  const [totalDuration, setTotalDuration] = useState(0);
  const { status: playQueueStatus } = useGetPlayQueue();
  const queue = usePlayQueue();

  function sumDuration(duration) {
    setTotalDuration((total) => total + parseInt(duration));
  }

  if (playQueueStatus === "loading") {
    return "Loading...";
  }

  return (
    <>
      <div className="flex items-center justify-between p-4 mb-1 text-base text-gray-600">
        <div>
          <FontAwesomeIcon icon={faListMusic} className="mr-2 fill-current" />
          <span className="border-b-2 border-transparent">Play Queue</span>
        </div>

        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faStopwatch} className="fill-current" />
          <div>{formatDuration(totalDuration)}</div>
        </div>
      </div>
      {queue?.map((id, index) => {
        return (
          <Track
            key={id}
            id={id}
            index={index}
            updateTotalDuration={sumDuration}
          />
        );
      })}
    </>
  );
}

function Track({ id, index, updateTotalDuration }) {
  const { data: item, status } = useGetTrackById(id);
  const { remove } = useQueue();

  useEffect(() => {
    if (item) {
      updateTotalDuration(item.duration_ms);
    }
  }, [item]);

  if (!item || status === "loading") {
    return (
      <div className="flex items-center w-full px-3 py-2 text-left border-b border-gray-300 opacity-0 cursor-pointer hover:bg-gray-300"></div>
    );
  }

  return (
    <motion.div
      onClick={() => remove(id, index)}
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
          className="w-12 h-12 rounded shadow"
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

function formatDuration(ms) {
  const s = Math.ceil(ms / 1000);
  const minutes = Math.ceil(s / 60);
  const seconds = s % 60;

  return `${minutes}:${String(seconds).length === 1 ? "0" + seconds : seconds}`;
}
