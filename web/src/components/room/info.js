import React from "react";
import { useGetRoom } from "hooks/use-rooms";

export default function Info() {
  const { data: room, status } = useGetRoom();

  if (status === "loading") {
    return "Loading...";
  }

  if (!room) return null;

  return (
    <div className="p-2 text-gray-800">
      <div className="tracking-wide text-gray-600 dark:text-gray-400 small-caps">
        Listening with
      </div>

      <div className="text-xl font-medium dark:text-gray-300">{room.name}</div>
      <div className="h-4"></div>
      <div className="tracking-wide text-gray-600 dark:text-gray-400 small-caps">
        Hosted by
      </div>
      <div className="h-2"></div>
      <div className="flex items-center">
        <img
          src={room.host.avatar_url}
          width="36"
          height="36"
          alt="Host User Avatar"
          className="rounded shadow"
        />
        <div className="ml-2 text-lg font-medium dark:text-gray-300">
          {room.host.username}
        </div>
      </div>

      {/* Share Link for Room */}
    </div>
  );
}
