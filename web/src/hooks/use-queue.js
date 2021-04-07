import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useUsername } from "hooks/use-username";
import { io } from "socket.io-client";

const {
  REACT_APP_WEBSOCKET_API_URL: WEBSOCKET_API_URL,
  REACT_APP_API_BASE_URL: API_BASE_URL,
} = process.env;

// selector fetch queue
export const playQueueAtom = atom({
  key: "crowdQ.playQueue",
  default: [],
});

export function usePlayQueue() {
  return useRecoilValue(playQueueAtom);
}

export function useQueue() {
  const { id } = useParams();
  const username = useUsername();

  const { data: room } = useQuery(id && ["room", id], async () => {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`);
    return await response.json();
  });
  const setQueue = useSetRecoilState(playQueueAtom);

  const socket = io(WEBSOCKET_API_URL);

  function addToQueue(item) {
    socket.emit("ADD_TO_QUEUE", {
      room,
      data: item,
      username: username || "Anonymous",
    });
    setQueue((queue) => [...queue, item]);
  }

  function removeFromQueue(index) {
    setQueue((queue) => [...queue.slice(0, index), ...queue.slice(index + 1)]);
  }

  function nextTrackInQueue() {
    setQueue((queue) => queue.slice(1));
  }

  return { addToQueue, removeFromQueue, nextTrackInQueue };
}
