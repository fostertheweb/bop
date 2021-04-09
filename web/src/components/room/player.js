import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusicSlash } from "@fortawesome/pro-duotone-svg-icons";
import { useIsPlaying, usePlayNextTrack } from "hooks/use-player";
import { useCurrentPlayback } from "hooks/use-current-playback";
import {
  useLightAccentColor,
  useSetDarkAccentColor,
  useSetLightAccentColor,
} from "hooks/use-accent-color";
import styled from "styled-components";
import * as Vibrant from "node-vibrant";
import Reactions from "components/room/reactions";

export default function Player() {
  const [playNextTrack] = usePlayNextTrack();
  const isPlaying = useIsPlaying();
  const [progress, setProgress] = useState(0);
  const timer = useRef(null);

  const [backgroundGradient, setBackgroundGradient] = useState();
  const setLightAccentColor = useSetLightAccentColor();
  const setDarkAccentColor = useSetDarkAccentColor();
  const lightAccentColor = useLightAccentColor();

  const currentPlayback = useCurrentPlayback();

  console.log({ currentPlayback });

  useEffect(() => {
    if (currentPlayback) {
      Vibrant.from(currentPlayback.album.images[1].url)
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

    // eslint-disable-next-line
  }, [currentPlayback]);

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
    <PlayerBackground colors={backgroundGradient} className="p-4 bg-gray-600">
      <div className="box-border sticky top-0 flex items-center justify-center w-full bg-transparent">
        <div className="w-1/3">
          <div className="flex items-center justify-between px-2">
            <CurrentPlayback item={currentPlayback} />
            <Reactions />
          </div>

          <VerticalSpace />
          <div
            style={{ height: "4px", backgroundColor: "rgba(0,0,0,0.3)" }}
            className="rounded">
            <motion.div
              style={{ height: "4px", backgroundColor: lightAccentColor }}
              className="rounded"
              animate={{
                width: `${(
                  (progress * 100) /
                  currentPlayback?.duration
                ).toFixed(2)}%`,
              }}
              transition={{ ease: "linear", duration: 1.6 }}></motion.div>
          </div>
        </div>
      </div>
    </PlayerBackground>
  );
}

function CurrentPlayback({ item }) {
  if (item && item.album) {
    return (
      <div className="flex items-center">
        <div key={item.id} className="flex items-center w-full text-left">
          <div
            className="flex-shrink-0"
            style={{ background: "rgba(0,0,0,0.2)" }}>
            <img
              src={item.album.images[1].url}
              width="48"
              height="48"
              alt="album art"
              className="shadow"
            />
          </div>

          <div className="ml-2">
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

const PlayerBackground = styled.div`
  position: relative;
  background: ${(props) => props.colors};
  box-shadow: inset 0 2px rgba(255, 255, 255, 0.25);
`;

const VerticalSpace = () => <div className="h-2"></div>;
