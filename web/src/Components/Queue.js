import React, { useContext, useEffect } from "react";
import { QueueContext } from "../context/QueueContext";

export default function() {
  const queue = useContext(QueueContext);

  return (
    <ol>
      {queue?.map(item => (
        <li key={item.id}>
          {item.name} by {item.artists.map(artist => artist.name).join(", ")}
        </li>
      ))}
      {/* {queue[0] && JSON.stringify(Object.keys(queue[0]))} */}
    </ol>
  );
}
