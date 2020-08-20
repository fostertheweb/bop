import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faStepBackward,
  faStepForward,
  faPause,
} from "@fortawesome/pro-solid-svg-icons";
import { motion } from "framer-motion";
import { usePlayer, isPlayingAtom } from "hooks/use-player";
import { useRecoilValue } from "recoil";

export default function PlayerControls() {
  const { restartCurrentTrack, playNextTrack, play, pause } = usePlayer();
  const isPlaying = useRecoilValue(isPlayingAtom);

  return (
    <div>
      <div className="flex items-center justify-center">
        <motion.button
          className="cq-text-white hover:text-gray-400"
          whileTap={{ scale: 0.8 }}
          onClick={() => restartCurrentTrack()}>
          <FontAwesomeIcon icon={faStepBackward} size="lg" />
        </motion.button>
        <motion.button
          className="cq-text-green px-4 hover:text-teal-400"
          whileTap={{ scale: 0.8 }}
          onClick={() => (isPlaying ? pause() : play())}>
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} size="2x" />
        </motion.button>

        <motion.button
          className="cq-text-white hover:text-gray-400"
          whileTap={{ scale: 0.8 }}
          onClick={() => playNextTrack()}>
          <FontAwesomeIcon icon={faStepForward} size="lg" />
        </motion.button>
      </div>
    </div>
  );
}
