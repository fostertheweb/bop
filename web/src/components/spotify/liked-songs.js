import React from "react";
import { useGetLikedSongs } from "hooks/spotify/use-liked-songs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faMusic } from "@fortawesome/pro-solid-svg-icons";
import { useQueue } from "hooks/use-queue";
import NotLoggedIn from "./not-logged-in";
import { useUserDetails } from "hooks/spotify/use-user-details";

export default function LikedSongs() {
  const { data: user } = useUserDetails();
  const { data: tracks, status } = useGetLikedSongs();

  return (
    <>
      {/* gradient background for sticky headers */}
      <div className="sticky top-0 flex items-center justify-between w-full p-4 mb-1 text-base text-gray-600 bg-white dark:text-gray-200 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <div className="border-2 border-transparent">
            <FontAwesomeIcon icon={faHeart} className="mr-2 fill-current" />
            <span>Liked Songs</span>
          </div>
        </div>
      </div>

      {status === "loading" ? (
        <SkeletonSearchResults />
      ) : user ? (
        <Tracks data={tracks} />
      ) : (
        <NotLoggedIn />
      )}
    </>
  );
}

function Tracks({ data: tracks }) {
  const { add } = useQueue();
  return (
    <div>
      {tracks?.map(({ track: item }) => (
        <button
          onClick={() => add(item)}
          key={item.id}
          className="flex items-center w-full px-3 py-2 text-left border-b border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700">
          <div className="">
            <img
              src={item.album.images[2].url}
              alt="album art"
              className="w-12 h-12 rounded shadow"
            />
          </div>
          <div className="w-3"></div>
          <div>
            <div className="text-gray-700 dark:text-gray-300">{item.name}</div>
            <div className="text-gray-600 dark:text-gray-400">
              {item.artists.map((artist) => artist.name).join(", ")}
            </div>
          </div>
        </button>
      ))}
    </div>
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
