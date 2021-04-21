import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompactDisc } from "@fortawesome/pro-duotone-svg-icons";
import { usePlayQueue, useQueue } from "hooks/use-queue";
import { faPlay } from "@fortawesome/pro-solid-svg-icons";

export default function CurrentPlayback({ item, loading, playing }) {
  const playQueue = usePlayQueue();
  const { playNext } = useQueue();

  return (
    <div className="flex items-center text-gray-400">
      {item && playing ? (
        <Playback item={item} />
      ) : loading ? (
        <Loading />
      ) : (
        <PlayButton onClick={playNext} disabled={playQueue.length === 0} />
      )}
    </div>
  );
}

function Playback({ item: { id, album, name, artists } }) {
  return (
    <div key={id} className="flex items-center w-full text-left">
      <div className="flex-shrink-0" style={{ background: "rgba(0,0,0,0.2)" }}>
        <img
          src={album?.images[2].url}
          width="48"
          height="48"
          alt="album art"
          className="rounded shadow"
        />
      </div>
      <div className="ml-3">
        <div style={{ color: "rgba(255,255,255,0.8)" }}>{name}</div>
        <div style={{ color: "rgba(255,255,255,0.6)" }}>{artists[0].name}</div>
      </div>
    </div>
  );
}

function PlayButton({ disabled, onClick }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{ width: "48px", height: "48px" }}
      className={`flex items-center justify-center ${
        disabled ? "text-gray-500" : "text-gray-300 hover:text-gray-100"
      }`}>
      <FontAwesomeIcon
        icon={faPlay}
        size="2x"
        className="fill-current filter drop-shadow"
      />
    </button>
  );
}

function Loading() {
  return (
    <div className="flex items-center">
      <div
        style={{ width: "48px", height: "48px" }}
        className="flex items-center justify-center bg-gray-500 rounded shadow">
        <FontAwesomeIcon
          icon={faCompactDisc}
          size="2x"
          className="text-gray-300 fill-current"
          spin
        />
      </div>
      <div className="ml-3 animate-pulse">
        <div
          className="w-40 h-2 rounded-sm"
          style={{ backgroundColor: "rgba(255,255,255,0.8)" }}></div>
        <div className="h-2"></div>
        <div
          className="w-20 h-2 rounded-sm"
          style={{ backgroundColor: "rgba(255,255,255,0.6)" }}></div>
      </div>
    </div>
  );
}
