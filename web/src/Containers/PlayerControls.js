import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStepBackward, faStepForward, faPause } from "@fortawesome/pro-solid-svg-icons";
import { motion } from "framer-motion";
import { usePlayer } from "../hooks/usePlayer";

export default function PlayerControls() {
  const { skipPlayback, playOrPause, isPlaying } = usePlayer();

  return (
    <div>
      <div className="flex items-center justify-center">
        <motion.button
          className="text-gray-500 hover:text-gray-400"
          whileTap={{ scale: 0.8 }}
          onClick={() => skipPlayback("previous")}>
          <FontAwesomeIcon icon={faStepBackward} size="lg" />
        </motion.button>
        <motion.button
          className="text-teal-500 px-4 hover:text-teal-400"
          whileTap={{ scale: 0.8 }}
          onClick={() => playOrPause()}>
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} size="2x" />
        </motion.button>

        <motion.button
          className="text-gray-500 hover:text-gray-400"
          whileTap={{ scale: 0.8 }}
          onClick={() => skipPlayback("next")}>
          <FontAwesomeIcon icon={faStepForward} size="lg" />
        </motion.button>
      </div>
    </div>
  );
}