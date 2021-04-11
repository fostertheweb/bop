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

export default function CurrentPlayback({ item, loading }) {
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
            src={item.album.images[2].url}
            width="48"
            height="48"
            alt="album art"
            className="shadow"
          />
        </div>
        <div className="ml-2">
          <div style={{ color: "rgba(255,255,255,0.8)" }}>{item.name}</div>
          <div style={{ color: "rgba(255,255,255,0.6)" }}>
            {item.artists[0].name}
          </div>
        </div>
      </div>
    </div>
  );
}
