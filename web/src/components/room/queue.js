import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQueue, usePlayQueue } from "hooks/use-queue";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListMusic } from "@fortawesome/pro-solid-svg-icons";
import { useGetPlayQueue } from "hooks/use-queue";
import { useGetTrackById } from "hooks/use-tracks";
import {
  faPlay,
  faStopwatch,
  faMusic,
} from "@fortawesome/pro-duotone-svg-icons";
import { useIsPlaying } from "hooks/use-player";

export default function Queue() {
  const [totalDuration, setTotalDuration] = useState(0);
  const { data: queue, status: playQueueStatus } = useGetPlayQueue();
  const { remove, next } = useQueue();
  const isPlaying = useIsPlaying();

  function sumDuration(duration) {
    setTotalDuration((total) => total + parseInt(duration));
  }

  if (playQueueStatus === "loading") {
    console.log("FETCHING THE PLAY QUEUE");
    return "Loading...";
  }

  return (
    <>
      <div className="flex items-center justify-between p-4 mb-1 text-base text-gray-600">
        <div className="flex items-center gap-2">
          <div>
            <FontAwesomeIcon icon={faListMusic} className="mr-2 fill-current" />
            <span className="border-b-2 border-transparent">Play Queue</span>
          </div>
          {queue.length > 0 && !isPlaying ? (
            <button
              onClick={next}
              className="flex items-center gap-2 p-1 text-gray-600 bg-gray-300 rounded hover:text-gray-700 hover:bg-gray-400">
              <FontAwesomeIcon icon={faPlay} className="fill-current" />
              <span className="text-xs font-medium tracking-wide uppercase">
                Start
              </span>
            </button>
          ) : null}
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
            remove={remove}
            updateTotalDuration={sumDuration}
          />
        );
      })}
    </>
  );
}

function Track({ id, index, remove, updateTotalDuration }) {
  const { data: item, status } = useGetTrackById(id);

  useEffect(() => {
    if (item) {
      updateTotalDuration(item.duration_ms);
    }
    // eslint-disable-next-line
  }, [item]);

  if (!item || status === "loading") {
    return (
      <motion.div
        className="flex items-center px-3 py-2 border-b border-gray-200"
        key={index}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: "spring", stiffness: 300, damping: 200 },
          opacity: { duration: 0.2 },
        }}>
        <div className="flex items-center justify-center w-12 h-12 bg-gray-300 rounded shadow">
          <FontAwesomeIcon
            icon={faMusic}
            size="lg"
            className="text-gray-500 fill-current"
          />
        </div>
        <div className="ml-2 animate-pulse">
          <div className="w-40 h-2 bg-gray-400 rounded-sm"></div>
          <div className="h-2"></div>
          <div className="w-20 h-2 bg-gray-300 rounded-sm"></div>
        </div>
      </motion.div>
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
