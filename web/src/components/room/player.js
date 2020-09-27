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
    <PlayerBackground colors={backgroundGradient} className="p-4 bg-gray-600">
      <AlbumBackdrop />
      <div className="box-border bg-transparent sticky top-0 w-full flex items-center justify-between">
        <div className="w-1/3">
          <CurrentPlayback
            item={currentPlayback?.item}
            loading={currentPlaybackStatus === "loading"}
          />
        </div>
        <div className="w-1/3">
          {isHost && <PlayerControls />}
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
                  currentPlayback?.item?.duration_ms
                ).toFixed(2)}%`,
              }}
              transition={{ ease: "linear", duration: 1.6 }}></motion.div>
          </div>
        </div>
        <div className="w-1/3 flex items-center justify-end">
          {isHost && <Devices />}
        </div>
      </div>
    </PlayerBackground>
  );
}

function CurrentPlayback({ item, loading }) {
  if (loading) {
    return (
      <div className="text-gray-600 flex items-center">
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
          <div style={{ background: "rgba(0,0,0,0.2)" }}>
            <img
              src={item.album.images[1].url}
              width="60"
              height="60"
              alt="album art"
              className="shadow"
            />
          </div>
          <HorizontalSpace />
          <div>
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
    <div className="text-gray-400 flex items-center">
      <div
        style={{ width: "60px", height: "60px" }}
        className="flex items-center justify-center">
        <FontAwesomeIcon
          icon={faMusicSlash}
          size="2x"
          className="fill-current"
        />
      </div>
      <HorizontalSpace />
      <div>Add songs to the Play Queue</div>
    </div>
  );
}

const PlayerBackground = styled.div`
  position: relative;
  background: ${(props) => props.colors};
  box-shadow: inset 0 2px rgba(255, 255, 255, 0.25);
`;

const VerticalSpace = () => <div className="h-2"></div>;
const HorizontalSpace = () => <div className="w-8"></div>;

const AlbumBackdrop = () => <div className="album-backdrop"></div>;
