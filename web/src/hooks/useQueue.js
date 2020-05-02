import React, { useContext, useState } from "react";

export const QueueContext = React.createContext([]);

export function QueueProvider({ children }) {
  const queue = useQueueProvider();
  return <QueueContext.Provider value={queue}>{children}</QueueContext.Provider>;
}

export function useQueue() {
  return useContext(QueueContext);
}

export function useQueueProvider() {
  const [queue, setQueue] = useState([]);

  function addToQueue(item) {
    setQueue([...queue, item]);
  }

  function removeFromQueue(index) {
    setQueue([...queue.slice(0, index), ...queue.slice(index + 1)]);
  }

  return { queue, addToQueue, removeFromQueue };
}
