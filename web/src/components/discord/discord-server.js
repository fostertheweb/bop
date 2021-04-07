import React from "react";
import { useParams } from "react-router";
import { useRoom } from "hooks/use-rooms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";

export default function DiscordServer() {
  const { id } = useParams();
  const { data: room, status } = useRoom(id);

  if (status === "loading") {
    return <FontAwesomeIcon icon={faSpinnerThird} spin />;
  }

  return (
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <img
          src={room.icon_url}
          width="60"
          height="60"
          alt="Discord Server Icon"
          className="rounded shadow"
        />
      </div>

      <div className="ml-4 text-sm text-white">
        <div>Listening with {room.name}</div>
        <div>Hosted by {room.host.username}</div>
      </div>
    </div>
  );
}
