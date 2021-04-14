import React from "react";
import {
  useCurrentPlayback,
  useGetCurrentPlayback,
} from "hooks/use-current-playback";
import styled from "styled-components";
import Reactions from "components/room/reactions";
import Progress from "components/room/progress";
import { useVibrant } from "hooks/use-vibrant";
import CurrentPlayback from "components/room/current-playback";
import { useGetTrackById } from "hooks/use-tracks";
import { useIsPlaying, useIsPlaybackLoading } from "hooks/use-player";
import { usePlayQueue, useQueue } from "hooks/use-queue";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/pro-duotone-svg-icons";

export default function Player() {
  const { status: getPlaybackStatus } = useGetCurrentPlayback();
  const currentPlayback = useCurrentPlayback();
  const { data: track, status: getTrackStatus } = useGetTrackById(
    currentPlayback?.track_id,
  );
  const { background, lightAccent } = useVibrant(track?.album.images[2].url);
  const isPlaybackLoading = useIsPlaybackLoading();
  const loading =
    getPlaybackStatus === "loading" ||
    getTrackStatus === "loading" ||
    isPlaybackLoading;
  const isPlaying = useIsPlaying();
  const playQueue = usePlayQueue();
  const { playNext } = useQueue();

  return (
    <PlayerBackground gradient={background} className="p-4 bg-gray-600">
      <div className="box-border sticky top-0 flex items-center justify-center w-full bg-transparent">
        <div className="w-1/3">
          <div className="flex items-center justify-between px-2">
            <CurrentPlayback item={track} loading={loading} />
            <PlayButton
              onClick={playNext}
              show={!isPlaying && !loading}
              disabled={playQueue.length === 0}
            />
            <Reactions disabled={playQueue.length === 0 || loading} />
          </div>

          <div className="h-2"></div>
          <Progress
            currentProgress={currentPlayback?.progress_ms}
            duration={currentPlayback?.duration_ms}
            color={lightAccent}
          />
        </div>
      </div>
    </PlayerBackground>
  );
}

function PlayButton({ disabled, show, onClick }) {
  if (!show) return null;

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{ width: "48px", height: "48px" }}
      className={`flex items-center justify-center ${
        disabled ? "text-gray-500" : "text-gray-300 hover:text-gray-100"
      }`}>
      <FontAwesomeIcon icon={faPlayCircle} size="3x" className="fill-current" />
    </button>
  );
}

const PlayerBackground = styled.div`
  position: relative;
  background: ${(props) => props.gradient};
  box-shadow: inset 0 2px rgba(255, 255, 255, 0.25);
`;
