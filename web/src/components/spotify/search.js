import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { useQueue } from "hooks/use-queue";
import { useSearch } from "hooks/spotify/use-search";
import { useDebounce } from "hooks/use-debounce";
import {
  faTimesCircle,
  faMusic,
  faSpinnerThird,
} from "@fortawesome/pro-duotone-svg-icons";

export default function Search() {
  const { add } = useQueue();
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 500);
  const { isFetching: isLoading, data: tracks } = useSearch(debounced);
  const searchInputRef = useRef(null);

  return (
    <>
      <div className="sticky top-0 p-2 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-2 p-2 text-base text-gray-600 bg-gray-200 border-2 border-gray-400 rounded dark:border-gray-600 dark:text-gray-200 dark:bg-gray-900 focus-within:border-green-500 focus-within:bg-gray-100">
          <FontAwesomeIcon
            icon={isLoading ? faSpinnerThird : faSpotify}
            size="lg"
            className="text-gray-600 fill-current dark:text-gray-400"
            spin={isLoading}
          />
          <input
            className="flex-grow text-base text-gray-600 bg-transparent rounded appearance-none dark:text-gray-200 focus:outline-none"
            id="cqSearch"
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
                className="text-gray-600 fill-current dark:text-gray-400"
              />
            </button>
          ) : null}
        </div>
      </div>

      {isLoading ? (
        <SkeletonSearchResults />
      ) : (
        <div>
          {tracks?.map((item) => (
            <button
              onClick={() => add(item)}
              key={item.id}
              className="flex items-center w-full px-3 py-2 text-left border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
              <div className="">
                <img
                  src={item.album.images[2].url}
                  alt="album art"
                  className="w-12 h-12 rounded shadow"
                />
              </div>
              <div className="w-3"></div>
              <div>
                <div className="text-gray-700 dark:text-gray-300">
                  {item.name}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
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

function SkeletonSearchResults() {
  return Array.from({ length: 10 }, (_, index) => (
    <div
      className="flex items-center px-3 py-2 border-b border-gray-200 dark:border-gray-700"
      key={index}>
      <div className="flex items-center justify-center w-12 h-12 bg-gray-300 rounded shadow dark:bg-gray-800">
        <FontAwesomeIcon
          icon={faMusic}
          size="lg"
          className="text-gray-500 fill-current"
        />
      </div>
      <div className="ml-2 animate-pulse">
        <div className="w-40 h-2 bg-gray-400 rounded-sm dark:bg-gray-600"></div>
        <div className="h-2"></div>
        <div className="w-20 h-2 bg-gray-300 rounded-sm dark:bg-gray-500"></div>
      </div>
    </div>
  ));
}
