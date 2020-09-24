import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStepBackward,
  faStepForward,
  faPauseCircle,
  faPlayCircle,
} from "@fortawesome/pro-duotone-svg-icons";
import { motion } from "framer-motion";
import {
  useIsPlaying,
  usePlay,
  usePause,
  usePlayNextTrack,
  useRestartCurrentTrack,
} from "hooks/use-player";

export default function PlayerControls() {
  const [play] = usePlay();
  const [pause] = usePause();
  const [playNextTrack] = usePlayNextTrack();
  const [restartCurrentTrack] = useRestartCurrentTrack();
  const isPlaying = useIsPlaying();

  return (
    <div>
      <div className="flex items-center justify-center text-white">
        <motion.button
          className="hover:text-gray-400"
          whileTap={{ scale: 0.8 }}
          onClick={() => restartCurrentTrack()}>
          <FontAwesomeIcon icon={faStepBackward} size="lg" />
        </motion.button>
        <motion.button
          className="px-4 text-white hover:text-gray-400"
          whileTap={{ scale: 0.8 }}
          onClick={() => (isPlaying ? pause() : play())}>
          <FontAwesomeIcon
            icon={isPlaying ? faPauseCircle : faPlayCircle}
            size="3x"
            className="fill-current"
          />
        </motion.button>

        <motion.button
          className="hover:text-gray-400"
          whileTap={{ scale: 0.8 }}
          onClick={() => playNextTrack()}>
          <FontAwesomeIcon icon={faStepForward} size="lg" />
        </motion.button>
      </div>
    </div>
  );
}
