import React, { useEffect, useRef, useState } from "react";
import { useIsPlaying } from "hooks/use-player";
import { motion } from "framer-motion";
import { useQueryCache } from "react-query";
import { useRoom } from "hooks/use-rooms";

export default function Progress({ currentProgress = 0, duration, color }) {
  const isPlaying = useIsPlaying();
  const [progress, setProgress] = useState(currentProgress);
  const timer = useRef(null);

  useEffect(() => {
    setProgress(currentProgress);
  }, [currentProgress]);

  useEffect(() => {
    function tick() {
      setProgress(progress + 1500);
    }

    if (isPlaying) {
      clearInterval(timer.current);
      timer.current = setInterval(() => tick(), 1500);
    }

    if (isPlaying === false) {
      clearInterval(timer.current);
    }

    if (progress >= duration) {
      clearInterval(timer.current);
    }

    return () => clearInterval(timer.current);
    // eslint-disable-next-line
  }, [isPlaying, progress]);

  return (
    <div
      style={{ height: "4px", backgroundColor: "rgba(0,0,0,0.3)" }}
      className="rounded">
      {duration ? (
        <motion.div
          style={{ height: "4px", backgroundColor: color }}
          className="rounded"
          animate={{
            width: `${((progress * 100) / duration).toFixed(2)}%`,
          }}
          transition={{ ease: "linear", duration: 1.6 }}></motion.div>
      ) : null}
    </div>
  );
}
