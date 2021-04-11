import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusicSlash } from "@fortawesome/pro-duotone-svg-icons";
import {
  useCurrentPlayback,
  useGetCurrentPlayback,
} from "hooks/use-current-playback";
import styled from "styled-components";
import Reactions from "components/room/reactions";
import Progress from "components/room/progress";
import { useVibrant } from "hooks/use-vibrant";

export default function Player() {
  const { status: getPlaybackStatus } = useGetCurrentPlayback();
  const currentPlayback = useCurrentPlayback();
  const { background, lightAccent } = useVibrant(
    currentPlayback?.album_art_url,
  );

  return (
    <PlayerBackground gradient={background} className="p-4 bg-gray-600">
      <div className="box-border sticky top-0 flex items-center justify-center w-full bg-transparent">
        <div className="w-1/3">
          <div className="flex items-center justify-between px-2">
            <CurrentPlayback
              item={currentPlayback}
              loading={getPlaybackStatus === "loading"}
            />
            <Reactions />
          </div>
          <VerticalSpace />
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

function CurrentPlayback({ item, loading }) {
  if (!item || loading) {
    return (
      <div className="flex items-center text-gray-400">
        <div
          style={{ width: "48px", height: "48px" }}
          className="flex items-center justify-center bg-gray-500 shadow">
          <FontAwesomeIcon
            icon={faMusicSlash}
            size="lg"
            className="text-gray-300 fill-current"
          />
        </div>

        <div className="ml-2">Add songs to the Play Queue</div>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <div key={item.id} className="flex items-center w-full text-left">
        <div
          className="flex-shrink-0"
          style={{ background: "rgba(0,0,0,0.2)" }}>
          <img
            src={item.album_art_url}
            width="48"
            height="48"
            alt="album art"
            className="shadow"
          />
        </div>
        <div className="ml-2">
          <div style={{ color: "rgba(255,255,255,0.8)" }}>{item.name}</div>
          <div style={{ color: "rgba(255,255,255,0.6)" }}>{item.artist}</div>
        </div>
      </div>
    </div>
  );
}

const PlayerBackground = styled.div`
  position: relative;
  background: ${(props) => props.gradient};
  box-shadow: inset 0 2px rgba(255, 255, 255, 0.25);
`;

const VerticalSpace = () => <div className="h-2"></div>;
