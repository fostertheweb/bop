import React from "react";

const item = {
  id: "12345",
  name: "Late Night",
  album: {
    images: [
      {},
      {},
      {
        url: "https://i.scdn.co/image/ab67616d00004851fe1c22315738dd6e313e400f",
      },
    ],
  },
  artists: [
    {
      name: "Lucky Daye",
    },
  ],
};

export default function NowPlaying() {
  return (
    <div className="p-2 bg-gray-900 sticky top-0">
      <div className="px-2 text-gray-600">Now Playing</div>
      <div key={item.id} className="text-left flex items-center w-full">
        <div className="p-2">
          <img src={item.album.images[2].url} alt="album art" className="shadow" />
        </div>
        <div className="ml-2">
          <div className="text-gray-400">{item.name}</div>
          <div className="text-gray-500">{item.artists.map(artist => artist.name).join(", ")}</div>
        </div>
      </div>
    </div>
  );
}
