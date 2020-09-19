import React, { useEffect, useState, useRef } from "react";
import PlayerControls from "components/room/player-controls";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusicSlash, faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import Devices from "components/room/devices";
import { useIsPlaying, usePlayNextTrack } from "hooks/use-player";
import { useIsHost } from "hooks/use-is-host";
import { useCurrentPlayback } from "hooks/use-current-playback";
import styled from "styled-components";
import * as Vibrant from "node-vibrant";

export default function Player() {
  const isHost = useIsHost();
  const {
    status: currentPlaybackStatus,
    data: currentPlayback,
  } = useCurrentPlayback();
  const [playNextTrack] = usePlayNextTrack();
  const isPlaying = useIsPlaying();
  const [progress, setProgress] = useState(0);
  const timer = useRef(null);
  const [backgroundGradient, setBackgroundGradient] = useState();
  const [accentColor, setAccentColor] = useState("white");

  useEffect(() => {
    if (currentPlayback) {
      if (currentPlayback.item) {
        Vibrant.from(currentPlayback.item.album.images[1].url)
          .getPalette()
          .then((palette) => {
            const colors = Object.keys(palette).reduce((theme, key) => {
              return { ...theme, [key]: palette[key].hex };
            }, {});
            console.log(colors);

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
    <PlayerBackground colors={backgroundGradient}>
      <div
        style={{ height: "2px", backgroundColor: "rgba(255,255,255,0.3)" }}
        className="w-full absolute top-0 shadow"></div>
      <motion.div
        style={{ height: "2px" }}
        className="bg-white absolute top-0 max-w-full"
        animate={{
          width: `${(
            (progress * 100) /
            currentPlayback?.item?.duration_ms
          ).toFixed(2)}%`,
        }}
        transition={{ ease: "linear", duration: 1.6 }}></motion.div>
      <div
        className="box-border bg-transparent sticky top-0 w-full flex items-center justify-between shadow"
        style={{ height: "80px" }}>
        <div className="w-1/3">
          {currentPlaybackStatus === "loading" ? (
            <div
              className="pl-4 text-gray-600 flex items-center"
              style={{ height: "80px" }}>
              <FontAwesomeIcon
                icon={faSpinnerThird}
                size="lg"
                className="fill-current mr-2"
                spin
              />
              {/* TODO: add skeleton lines */}
            </div>
          ) : currentPlayback?.item ? (
            <CurrentPlayback item={currentPlayback.item} />
          ) : (
            <div
              className="pl-4 text-gray-600 flex items-center"
              style={{ height: "80px" }}>
              <FontAwesomeIcon
                icon={faMusicSlash}
                size="lg"
                className="fill-current mr-2"
              />
              Add songs to the Play Queue
            </div>
          )}
        </div>
        {isHost && <HostControls color={accentColor} />}
      </div>
    </PlayerBackground>
  );
}

function CurrentPlayback({ item }) {
  return (
    <div>
      <div key={item.id} className="text-left flex items-center w-full">
        <div className="pl-4">
          <img
            src={item.album.images[1].url}
            width="48"
            height="48"
            alt="album art"
            className="shadow"
          />
        </div>
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

function HostControls(props) {
  return (
    <>
      <div className="w-1/3">
        <PlayerControls color={props.color} />
      </div>
      <div className="w-1/3 flex items-center justify-end">
        <Devices />
      </div>
    </>
  );
}

const PlayerBackground = styled.div`
  width: 100vw;
  position: relative;
  background: ${(props) => props.colors};
`;
