import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompactDisc,
  faMusicSlash,
} from "@fortawesome/pro-duotone-svg-icons";

export default function CurrentPlayback({ item, loading }) {
  return (
    <div className="flex items-center text-gray-400">
      {item ? (
        <div key={item.id} className="flex items-center w-full text-left">
          <div
            className="flex-shrink-0"
            style={{ background: "rgba(0,0,0,0.2)" }}>
            <img
              src={item.album.images[2].url}
              width="48"
              height="48"
              alt="album art"
              className="rounded shadow"
            />
          </div>
          <div className="ml-2">
            <div style={{ color: "rgba(255,255,255,0.8)" }}>{item.name}</div>
            <div style={{ color: "rgba(255,255,255,0.6)" }}>
              {item.artists[0].name}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center">
          <div
            style={{ width: "48px", height: "48px" }}
            className="flex items-center justify-center bg-gray-500 rounded shadow">
            {loading ? (
              <FontAwesomeIcon
                icon={faCompactDisc}
                size="2x"
                className="text-gray-300 fill-current"
                spin
              />
            ) : (
              <FontAwesomeIcon
                icon={faMusicSlash}
                size="lg"
                className="text-gray-300 fill-current"
              />
            )}
          </div>
          {loading ? (
            <div className="ml-2 animate-pulse">
              <div
                className="w-40 h-2 rounded-sm"
                style={{ backgroundColor: "rgba(255,255,255,0.8)" }}></div>
              <div className="h-2"></div>
              <div
                className="w-20 h-2 rounded-sm"
                style={{ backgroundColor: "rgba(255,255,255,0.6)" }}></div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
