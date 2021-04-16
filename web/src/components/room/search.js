import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { useQueue } from "hooks/use-queue";
import { useSearch } from "hooks/use-search";
import { useDebounce } from "hooks/use-debounce";
import {
  faTimesCircle,
  faMusic,
  faSpinnerThird,
} from "@fortawesome/pro-duotone-svg-icons";

function SkeletonSearchResults() {
  return Array.from({ length: 10 }, (_, index) => (
    <div
      className="flex items-center px-3 py-2 border-b border-gray-200"
      key={index}>
      <div className="flex items-center justify-center w-12 h-12 bg-gray-300 rounded shadow">
        <FontAwesomeIcon
          icon={faMusic}
          size="lg"
          className="text-gray-500 fill-current"
        />
      </div>
      <div className="ml-2 animate-pulse">
        <div className="w-40 h-2 bg-gray-400 rounded-sm"></div>
        <div className="h-2"></div>
        <div className="w-20 h-2 bg-gray-300 rounded-sm"></div>
      </div>
    </div>
  ));
}

export default function Search() {
  const { add } = useQueue();
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 500);
  const { isFetching: isLoading, data: tracks } = useSearch(debounced);
  const searchInputRef = useRef(null);

  return (
    <>
      <div className="sticky top-0 p-2 bg-white">
        <div className="flex items-center">
          <div className="flex items-center w-full text-base text-gray-600 bg-gray-100 border-2 border-gray-400 rounded focus-within:border-green-500 focus-within:bg-gray-800">
            <FontAwesomeIcon
              icon={isLoading ? faSpinnerThird : faSpotify}
              size="lg"
              className="ml-2 text-gray-600 fill-current"
              spin={isLoading}
            />
            <input
              className="w-full px-4 py-2 pl-2 text-base text-gray-600 bg-transparent rounded appearance-none focus:outline-none"
              id="search"
              placeholder="Search by track or artist"
              onChange={({ target }) => setQuery(target.value)}
              autoComplete="false"
              ref={searchInputRef}
            />
            {query.length > 0 ? (
              <button onClick={() => (searchInputRef.current.value = "")}>
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  size="lg"
                  className="mr-2 text-gray-600 fill-current"
                />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {isLoading ? (
        <SkeletonSearchResults />
      ) : (
        <div>
          {tracks?.map((item) => (
            <button
              onClick={() => add(item.id)}
              key={item.id}
              className="flex items-center w-full px-3 py-2 text-left border-b border-gray-200 hover:bg-gray-100">
              <div className="">
                <img
                  src={item.album.images[2].url}
                  alt="album art"
                  className="w-12 h-12 rounded shadow"
                />
              </div>
              <div className="w-3"></div>
              <div>
                <div className="text-gray-700">{item.name}</div>
                <div className="text-gray-600">
                  {item.artists.map((artist) => artist.name).join(", ")}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
