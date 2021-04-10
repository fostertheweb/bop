import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { useParams } from "react-router-dom";
import { useUsername } from "hooks/use-username";
import { io } from "socket.io-client";
import { useRoom } from "./use-rooms";
import { useEffect, useRef } from "react";
import { useSetCurrentPlayback } from "./use-current-playback";
import { useSetIsPlaying } from "./use-player";

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
  const { data: room } = useRoom();
  const setQueue = useSetRecoilState(playQueueAtom);
  const playQueue = usePlayQueue();
  const setCurrentPlayback = useSetCurrentPlayback();
  const setIsPlaying = useSetIsPlaying(true);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(WEBSOCKET_API_URL);

    socket.on("START", ({ item, duration }) => {
      setCurrentPlayback({ ...item, duration });
      setIsPlaying(true);
    });

    socketRef.current = socket;
  }, []);

  function addToQueue(item) {
    socketRef.current.emit("ADD_TO_QUEUE", {
      room,
      data: item,
      username: username || "Anonymous",
    });
    setQueue((queue) => [...queue, item]);
  }

  function removeFromQueue(index) {
    socketRef.current.emit("REMOVE_FROM_QUEUE", {
      room,
      data: index,
      username: username || "Anonymous",
    });
    setQueue((queue) => [...queue.slice(0, index), ...queue.slice(index + 1)]);
  }

  function nextTrackInQueue() {
    socketRef.current.emit("PLAY_NEXT_SONG", {
      room,
      data: playQueue[0],
    });
    setQueue((queue) => queue.slice(1));
  }

  return { addToQueue, removeFromQueue, nextTrackInQueue };
}
