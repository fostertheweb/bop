import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusicSlash } from "@fortawesome/pro-duotone-svg-icons";
import { useIsPlaying, usePlayNextTrack } from "hooks/use-player";
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
import DiscordServer from "components/discord/discord-server";
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

    // setProgress(parseInt(currentPlayback.progress_ms));

    // eslint-disable-next-line
  }, [currentPlayback, setProgress]);

  // useEffect(() => {
  //   if (progress >= parseInt(currentPlayback?.item?.duration_ms)) {
  //     clearInterval(timer.current);
  //     playNextTrack();
  //   }
  //   //eslint-disable-next-line
  // }, [progress]);

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
      <div className="box-border sticky top-0 flex items-center justify-between w-full bg-transparent">
        <div className="w-1/3 truncate max-w-1/3">
          <DiscordServer />
        </div>

        <div className="w-1/3">
          <CurrentPlayback item={currentPlayback} />
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
                  currentPlayback?.duration_ms
                ).toFixed(2)}%`,
              }}
              transition={{ ease: "linear", duration: 1.6 }}></motion.div>
          </div>
        </div>

        <div className="flex items-center justify-end w-1/3">
          <Reactions />
        </div>
      </div>
    </PlayerBackground>
  );
}

function CurrentPlayback({ item }) {
  if (item && item.album) {
    return (
      <div className="px-2">
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
        className="flex items-center justify-center">
        <FontAwesomeIcon
          icon={faMusicSlash}
          size="2x"
          className="fill-current"
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
const HorizontalSpace = () => <div className="flex-shrink-0 w-8"></div>;
