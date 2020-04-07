import React, { useContext, useEffect } from "react";
import { motion } from "framer-motion";

import { QueueContext } from "../context/QueueContext";
import { useAccessStorage } from "../hooks/useAccessStorage";
import { usePlayer, PlayerProvider } from "../hooks/usePlayer";
import NowPlaying from "./NowPlaying";

export default function Queue(props) {
  return (
    <PlayerProvider>
      <QueueContents {...props} />
    </PlayerProvider>
  );
}

function QueueContents({ dispatch }) {
  const queue = useContext(QueueContext);
  const { playPause } = usePlayer();
  const { tokens } = useAccessStorage();

  useEffect(() => {
    const isFirstTrack = queue.length === 1;
    const trackToQueue = queue.slice(-1)[0]?.uri;

    if (isFirstTrack) {
      playPause(queue[0].uri);
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
        {queue?.map((item, index) => {
          if (index === 0) {
            return null;
          }

          return (
            <motion.div
              key={item.id}
              className="text-left p-2 flex items-center w-full border-t border-gray-700 opacity-0"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 200 },
                opacity: { duration: 0.2 },
              }}>
              <div className="p-2">
                <img src={item.album.images[2].url} alt="album art" className="shadow w-10 h-10" />
              </div>
              <div className="ml-1">
                <div className="text-gray-400">{item.name}</div>
                <div className="text-gray-500">
                  {item.artists.map(artist => artist.name).join(", ")}
                </div>
              </div>
            </motion.div>
          );
        })}
      </>
    </div>
  );
}

const variants = {
  enter: direction => {
    return {
      x: direction > 0 ? -500 : 500,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: direction => {
    return {
      zIndex: 0,
      x: direction < 0 ? -500 : 500,
      opacity: 0,
    };
  },
};
