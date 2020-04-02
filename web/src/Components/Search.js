import React, { useState } from "react";
import useSpotify from "../hooks/useSpotify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";

export default function Search({ dispatch }) {
  const { searchSpotify } = useSpotify();
  const [results, setResults] = useState([]);

  const handleSearch = async query => {
    const { tracks } = await searchSpotify(query);
    setResults(tracks);
  };

  const addToQueue = payload => dispatch({ type: "addToQueue", payload });

  return (
    <div className="">
      <div className="p-4 bg-gray-800 sticky top-0 flex items-center">
        <FontAwesomeIcon icon={faSpotify} size="lg" className="text-gray-500 fill-current" />
        <input
          className="border-2 border-gray-700 text-base rounded ml-2 px-4 py-2 focus:outline-none focus:shadow-outline w-full bg-gray-900 text-gray-200"
          id="search"
          placeholder="Search by track or artist"
          onChange={({ target }) => handleSearch(target.value)}
        />
      </div>
      <div>
        {results?.items?.map(item => (
          <button
            onClick={() => addToQueue(item)}
            key={item.id}
            className="text-left p-2 flex items-center w-full border-b border-gray-900">
            <div className="p-2">
              <img src={item.album.images[2].url} alt="album art" className="shadow h-10 w-10" />
            </div>
            <div className="ml-1">
              <div className="text-gray-400">{item.name}</div>
              <div className="text-gray-500">
                {item.artists.map(artist => artist.name).join(", ")}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
