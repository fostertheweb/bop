import React, { useContext } from "react";
import { QueueContext } from "../context/QueueContext";

export default function() {
  const queue = useContext(QueueContext);

  return (
    <div>
      {/* {queue?.items?.map(item => (
      <span>
        {item.name} by {item.artists.map(artist => artist.name).join(", ")}
      </span>
    ))} */}
      {JSON.stringify(queue)}
    </div>
  );
}
