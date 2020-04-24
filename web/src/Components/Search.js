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
    <div className="p-2">
      <div className="sticky top-0 bg-gray-800">
        <div className="p-2 bg-gray-800 flex items-center">
          <div className="flex items-center border-2 border-gray-700 text-base rounded focus:outline-none focus:shadow-outline w-full bg-gray-900 text-gray-200">
            <FontAwesomeIcon
              icon={faSpotify}
              size="lg"
              className="text-gray-500 fill-current ml-2"
            />
            <input
              className="appearance-none text-base rounded px-4 py-2 pl-2 focus:outline-none w-full bg-gray-900 text-gray-200"
              id="search"
              placeholder="Search by track or artist"
              onChange={({ target }) => handleSearch(target.value)}
            />
          </div>
        </div>
      </div>
      <div className="overflow-y-scroll">
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
