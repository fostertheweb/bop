import React, { useEffect, useState, useRef } from "react";
import PlayerControls from "components/room/player-controls";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusicSlash, faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import Devices from "components/room/devices";
import { useIsPlaying, usePlayNextTrack } from "hooks/use-player";
import { useIsHost } from "hooks/use-is-host";
import {
  useCurrentPlayback,
  useGetCurrentPlayback,
} from "hooks/use-current-playback";
import {
  useLightAccentColor,
  useSetDarkAccentColor,
  useSetLightAccentColor,
} from "hooks/use-accent-color";
import styled from "styled-components";
import * as Vibrant from "node-vibrant";

export default function Player() {
  const isHost = useIsHost();
  const { status: currentPlaybackStatus } = useGetCurrentPlayback();
  const [playNextTrack] = usePlayNextTrack();
  const isPlaying = useIsPlaying();
  const [progress, setProgress] = useState(0);
  const timer = useRef(null);
  const [backgroundGradient, setBackgroundGradient] = useState();
  const setLightAccentColor = useSetLightAccentColor();
  const setDarkAccentColor = useSetDarkAccentColor();
  const lightAccentColor = useLightAccentColor();
  const currentPlayback = useCurrentPlayback();

  useEffect(() => {
    if (currentPlayback) {
      if (currentPlayback.item) {
        Vibrant.from(currentPlayback.item.album.images[1].url)
          .getPalette()
          .then((palette) => {
            const colors = Object.keys(palette).reduce((theme, key) => {
              return { ...theme, [key]: palette[key].hex };
            }, {});
            setDarkAccentColor(colors.DarkVibrant);
            setLightAccentColor(colors.LightVibrant);
            setBackgroundGradient(
              `linear-gradient(0.3turn, ${[
                colors.DarkVibrant,
                colors.DarkMuted,
              ].join(",")})`,
            );
          })
          .catch((err) => {
            console.log(err);
          });
      }

      setProgress(parseInt(currentPlayback.progress_ms));
    }
    // eslint-disable-next-line
  }, [currentPlayback, setProgress]);

  useEffect(() => {
    if (progress >= parseInt(currentPlayback?.item?.duration_ms)) {
      clearInterval(timer.current);
      playNextTrack();
    }
    //eslint-disable-next-line
  }, [progress]);

  useEffect(() => {
    function tick() {
      setProgress(progress + 1500);
    }

    if (currentPlayback && isPlaying) {
      clearInterval(timer.current);
      timer.current = setInterval(() => tick(), 1500);
    }

    if (isPlaying === false) {
      clearInterval(timer.current);
    }

    return () => clearInterval(timer.current);
    // eslint-disable-next-line
  }, [currentPlayback, isPlaying, progress]);

  return (
    <PlayerBackground colors={backgroundGradient} className="bg-gray-600">
      <div
        style={{ height: "4px", backgroundColor: "rgba(0,0,0,0.3)" }}
        className="max-w-full"></div>
      <motion.div
        style={{ height: "4px", backgroundColor: lightAccentColor }}
        className="absolute top-0 max-w-full"
        animate={{
          width: `${(
            (progress * 100) /
            currentPlayback?.item?.duration_ms
          ).toFixed(2)}%`,
        }}
        transition={{ ease: "linear", duration: 1.6 }}></motion.div>
      <div
        className="box-border bg-transparent sticky top-0 w-full flex items-center justify-between"
        style={{ height: "76px" }}>
        <div className="w-1/3">
          <CurrentPlayback
            item={currentPlayback?.item}
            loading={currentPlaybackStatus === "loading"}
          />
        </div>
        {isHost && <HostControls />}
      </div>
    </PlayerBackground>
  );
}

function CurrentPlayback({ item, loading }) {
  if (loading) {
    return (
      <div
        className="pl-4 text-gray-600 flex items-center"
        style={{ height: "76px" }}>
        <FontAwesomeIcon
          icon={faSpinnerThird}
          size="lg"
          className="fill-current mr-2"
          spin
        />
        {/* TODO: add skeleton lines */}
      </div>
    );
  }

  if (item && item.album) {
    return (
      <div>
        <div key={item.id} className="text-left flex items-center w-full">
          <img
            src={item.album.images[1].url}
            width="60"
            height="60"
            alt="album art"
            className="ml-2 shadow"
          />
          <div className="pl-4">
            <div style={{ color: "rgba(255,255,255,0.8)" }}>{item.name}</div>
            <div style={{ color: "rgba(255,255,255,0.6)" }}>
              {item.artists.map((artist) => artist.name).join(", ")}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="pl-4 text-gray-400 flex items-center"
      style={{ height: "76px" }}>
      <FontAwesomeIcon
        icon={faMusicSlash}
        size="lg"
        className="fill-current mr-2"
      />
      Add songs to the Play Queue
    </div>
  );
}

function HostControls() {
  return (
    <>
      <div className="w-1/3">
        <PlayerControls />
      </div>
      <div className="w-1/3 flex items-center justify-end">
        <Devices />
      </div>
    </>
  );
}

const PlayerBackground = styled.div`
  position: relative;
  background: ${(props) => props.colors};
`;
