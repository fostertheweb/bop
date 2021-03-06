import React from "react";
import { motion } from "framer-motion";
import { usePlayQueue, useQueue } from "hooks/use-queue";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListMusic,
  faPlayCircle,
  faMusic,
  faAlbumCollection,
  faSearch,
} from "@fortawesome/pro-duotone-svg-icons";
import { useGetPlayQueue } from "hooks/use-queue";
import { useGetTrackById } from "hooks/spotify/use-tracks";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { faTimes } from "@fortawesome/pro-solid-svg-icons";

export default function Queue() {
  const { data: queue, status: playQueueStatus } = useGetPlayQueue();
  const { remove } = useQueue();
  const playQueue = usePlayQueue();

  if (playQueueStatus === "loading") {
    return "Loading...";
  }

  return (
    <>
      {/* gradient background for sticky headers */}
      <div className="sticky top-0 z-10 flex items-center justify-between w-full p-4 mb-1 text-base text-gray-600 bg-white lg:bg-gray-200 dark:text-gray-200 dark:bg-gray-800 lg:dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <div className="border-2 border-transparent">
            <FontAwesomeIcon icon={faListMusic} className="mr-2 fill-current" />
            <span>Play Queue</span>
          </div>
        </div>

        {/* <div>
          <FontAwesomeIcon icon={faStopwatch} className="mr-2 fill-current" />
          <span>{formatDuration(queueDuration)}</span>
        </div> */}
      </div>

      {playQueue.length > 0 ? (
        queue.map((id, index) => {
          return <Track key={id} id={id} index={index} remove={remove} />;
        })
      ) : (
        <div className="flex flex-col items-center justify-center flex-grow gap-4 text-gray-600 dark:text-gray-300">
          <FontAwesomeIcon
            icon={faAlbumCollection}
            size="4x"
            className="text-gray-500 fill-current dark:text-gray-400"
          />
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
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
              <span className="ml-2">Click the play button below</span>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

function Track({ id, index, remove }) {
  const { data: item, status } = useGetTrackById(id);
  // const setQueueDuration = useSetQueueDuration();

  // useEffect(() => {
  //   if (item) {
  //     setQueueDuration((total) => total + parseInt(item.duration_ms));
  //   }
  //   // eslint-disable-next-line
  // }, [item]);

  function handleRemoveTrack(id, index, duration) {
    remove(id, index);
    // setQueueDuration((total) => total - parseInt(duration));
  }

  if (!item || status === "loading") {
    return (
      <motion.div
        className="flex items-center px-3 py-2 border-b border-gray-200 dark:border-green-500"
        key={index}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: "spring", stiffness: 300, damping: 200 },
          opacity: { duration: 0.2 },
        }}>
        <div className="flex items-center justify-center w-12 h-12 bg-gray-300 rounded shadow dark:bg-gray-800">
          <FontAwesomeIcon
            icon={faMusic}
            size="lg"
            className="text-gray-500 fill-current"
          />
        </div>
        <div className="ml-2 animate-pulse">
          <div className="w-40 h-2 bg-gray-400 rounded-sm dark:bg-gray-600"></div>
          <div className="h-2"></div>
          <div className="w-20 h-2 bg-gray-300 rounded-sm dark:bg-gray-700"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex items-center justify-between w-full px-3 py-2 text-left border-b border-gray-300 opacity-0 cursor-pointer dark:border-gray-800 hover:bg-gray-300 dark:hover:bg-gray-800"
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 300, damping: 200 },
        opacity: { duration: 0.2 },
      }}>
      <div className="flex items-center">
        <img
          src={item.album.images[2].url}
          alt="album art"
          className="w-12 h-12 rounded shadow"
        />
        <div className="w-3"></div>
        <div>
          <div className="text-gray-700 dark:text-gray-300">{item.name}</div>
          <div className="text-gray-600 dark:text-gray-400">
            {item.artists.map((artist) => artist.name).join(", ")}
          </div>
        </div>
      </div>
      <div className="">
        <button
          onClick={() => handleRemoveTrack(id, index, item.duration_ms)}
          className="flex items-center px-2 py-1 text-gray-400 bg-gray-200 rounded dark:bg-gray-900 hover:bg-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 hover:text-gray-600">
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>
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

// function formatDuration(ms) {
//   const s = Math.ceil(ms / 1000);
//   const minutes = Math.ceil(s / 60);
//   const seconds = s % 60;

//   return `${minutes}:${String(seconds).length === 1 ? "0" + seconds : seconds}`;
// }
