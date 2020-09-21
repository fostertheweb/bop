import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { useRemoteQueue } from "hooks/use-remote-queue";
import { useSearch } from "hooks/use-search";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { useDebounce } from "hooks/use-debounce";

export default function Search() {
  const { addToQueue } = useRemoteQueue();
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 500);
  const { isFetching: isLoading, data: tracks } = useSearch(debounced);

  return (
    <div className="">
      <div className="sticky top-0 p-2 bg-white">
        <div className="flex items-center">
          <div className="flex items-center border-2 border-gray-400 text-base rounded bg-gray-100 focus-within:border-green-500 focus-within:bg-gray-800 w-full text-gray-600">
            <FontAwesomeIcon
              icon={isLoading ? faSpinnerThird : faSpotify}
              size="lg"
              className="text-gray-600 fill-current ml-2"
              spin={isLoading}
            />
            <input
              className="appearance-none bg-transparent text-base rounded px-4 py-2 pl-2 focus:outline-none w-full text-gray-600"
              id="search"
              placeholder="Search by track or artist"
              onChange={({ target }) => setQuery(target.value)}
              autoComplete="false"
            />
          </div>
        </div>
      </div>
      <div>
        {tracks?.map((item) => (
          <button
            onClick={() => addToQueue(item)}
            key={item.id}
            className="p-2 text-left flex items-center w-full border-b border-gray-200 hover:bg-gray-100">
            <div className="p-2">
              <img
                src={item.album.images[2].url}
                alt="album art"
                className="shadow h-10 w-10"
              />
            </div>
            <div className="ml-1">
              <div className="text-gray-700">{item.name}</div>
              <div className="text-gray-600">
                {item.artists.map((artist) => artist.name).join(", ")}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
