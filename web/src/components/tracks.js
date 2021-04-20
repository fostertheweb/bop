import React from "react";

export function TrackList() {
  return (
    <ul>
      <li>track</li>
    </ul>
  );
}

export function Track({ item }) {
  return (
    <>
      <div className="p-2">
        <img
          src={item.album.images[2].url}
          alt="album art"
          className="shadow w-10 h-10"
        />
      </div>
      <div className="ml-1">
        <div className="text-gray-400">{item.name}</div>
        <div className="text-gray-500">
          {item.artists.map((artist) => artist.name).join(", ")}
        </div>
      </div>
    </>
  );
}
