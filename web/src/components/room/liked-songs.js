import React from "react";
import { useLikedSongs } from "../../hooks/use-liked-songs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faMusic } from "@fortawesome/pro-solid-svg-icons";
import { useQueue } from "hooks/use-queue";
import { useUserDetails } from "hooks/use-user-details";

export default function LikedSongs() {
  const { data: user, status: userStatus } = useUserDetails();
  const { data: tracks, isFetching: isLoading } = useLikedSongs(user);
  const { add } = useQueue();

  console.log(tracks);

  return (
    <>
      {/* gradient background for sticky headers */}
      <div className="sticky top-0 flex items-center justify-between w-full p-4 mb-1 text-base text-gray-600 bg-white">
        <div className="flex items-center gap-2">
          <div className="border-2 border-transparent">
            <FontAwesomeIcon icon={faHeart} className="mr-2 fill-current" />
            <span>Liked Songs</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <SkeletonSearchResults />
      ) : (
        <div>
          {tracks?.map(({ track: item }) => (
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
