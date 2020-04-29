import React, { useContext, useReducer } from "react";

export const QueueContext = React.createContext([]);

export function QueueProvider({ children }) {
  const queue = useQueueProvider();
  return <QueueContext.Provider value={queue}>{children}</QueueContext.Provider>;
}

export function useQueue() {
  return useContext(QueueContext);
}

export function useQueueProvider() {
  const [queue, dispatch] = useReducer(queueReducer, []);

  return { queue, send: dispatch };
}

function queueReducer(state, { type, payload }) {
  switch (type) {
    case "addToQueue":
      return [...state, payload];
    case "removeFromQueue":
      return [...payload];
    default:
      throw new Error();
  }
}
