import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePlayQueue, useQueue } from "hooks/use-queue";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListMusic, faPlayCircle } from "@fortawesome/pro-duotone-svg-icons";
import { useGetPlayQueue } from "hooks/use-queue";
import { useGetTrackById } from "hooks/use-tracks";
import {
  faStopwatch,
  faMusic,
  faAlbumCollection,
  faSearch,
  faMusicSlash,
  faCloudMusic,
} from "@fortawesome/pro-duotone-svg-icons";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";

export default function Queue() {
  const [totalDuration, setTotalDuration] = useState(0);
  const { data: queue, status: playQueueStatus } = useGetPlayQueue();
  const { remove } = useQueue();
  const playQueue = usePlayQueue();

  function sumDuration(duration) {
    setTotalDuration((total) => total + parseInt(duration));
  }

  if (playQueueStatus === "loading") {
    console.log("FETCHING THE PLAY QUEUE");
    return "Loading...";
  }

  return (
    <>
      {/* gradient background for sticky headers */}
      <div className="sticky top-0 flex items-center justify-between w-full p-4 mb-1 text-base text-gray-600 bg-gray-200">
        <div className="flex items-center gap-2">
          <div>
            <FontAwesomeIcon icon={faListMusic} className="mr-2 fill-current" />
            <span className="border-b-2 border-transparent">Play Queue</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faStopwatch} className="fill-current" />
          <div>{formatDuration(totalDuration)}</div>
        </div>
      </div>

      {playQueue.length > 0 ? (
        queue.map((id, index) => {
          return (
            <Track
              key={id}
              id={id}
              index={index}
              remove={remove}
              updateTotalDuration={sumDuration}
            />
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center flex-grow gap-4 text-gray-600">
          <FontAwesomeIcon
            icon={faAlbumCollection}
            size="4x"
            className="text-gray-500 fill-current"
          />
          <h3 className="text-lg font-medium text-gray-700">
            Add to Play Queue
          </h3>
          <ul className="flex flex-col gap-3 mt-4">
            <li>
              <FontAwesomeIcon icon={faSearch} />
              <span className="ml-2">Search Spotify for music to add</span>
            </li>
            <li>
              <FontAwesomeIcon icon={faSpotify} />
              <span className="ml-2">
                Add songs from your Spotify playlists
              </span>
            </li>
            <li>
              <FontAwesomeIcon icon={faPlayCircle} />
              <span className="ml-2">Click the play button down below</span>
            </li>
          </ul>
        </div>
      )}
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
