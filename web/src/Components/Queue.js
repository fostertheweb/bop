import React, { useContext, useEffect } from "react";
import { QueueContext } from "../context/QueueContext";

export default function({ dispatch }) {
  const queue = useContext(QueueContext);

  useEffect(() => {
    console.log(queue);
  }, [queue]);

  return (
    <ol>
      {queue?.map(item => (
        <li key={item.id}>
          {item.name} by {item.artists.map(artist => artist.name).join(", ")}
        </li>
      ))}
    </ol>
  );
}
