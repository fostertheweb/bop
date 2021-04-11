import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { useUsername } from "hooks/use-username";
import { io } from "socket.io-client";
import { useRoom } from "./use-rooms";
import { useEffect, useRef } from "react";
import { useSetCurrentPlayback } from "./use-current-playback";
import { useIsPlaying, useSetIsPlaying } from "./use-player";
import { useParams } from "react-router";
import { useQuery } from "react-query";
import axios from "axios";

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

export function useSetPlayQueue() {
  return useSetRecoilState(playQueueAtom);
}

export function useQueue() {
  const username = useUsername();
  const { data: room } = useRoom();
  const playQueue = usePlayQueue();
  const setQueue = useSetPlayQueue();
  const setCurrentPlayback = useSetCurrentPlayback();
  const isPlaying = useIsPlaying();
  const setIsPlaying = useSetIsPlaying();
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(WEBSOCKET_API_URL);

    socket.on("PLAYBACK_START", (currentPlayback) => {
      setCurrentPlayback(currentPlayback);
      setIsPlaying(true);
    });

    socket.on("PLAYBACK_END", () => {
      next();
    });

    socketRef.current = socket;
  }, []);

  function add(trackId) {
    if (playQueue.length === 0 && !isPlaying) {
      play(trackId);
    } else {
      socketRef.current.emit("ADD_TO_QUEUE", {
        room,
        track_id: trackId,
        username: username || "Anonymous",
      });
      setQueue((queue) => [...queue, trackId]);
    }
  }

  function remove(trackId, index) {
    socketRef.current.emit("REMOVE_FROM_QUEUE", {
      room,
      track_id: trackId,
    });
    setQueue((queue) => [...queue.slice(0, index), ...queue.slice(index + 1)]);
  }

  function play(trackId) {
    socketRef.current.emit("PLAY_SONG", {
      room,
      track_id: trackId,
    });
  }

  function next() {
    play(playQueue[0]);
    setQueue((queue) => queue.slice(1));
  }

  return { add, remove, next };
}

export function useGetPlayQueue() {
  const { id } = useParams();
  const setPlayQueue = useSetPlayQueue();

  return useQuery(
    id && ["playQueue", id],
    async () => {
      const { data } = await axios.get(`${API_BASE_URL}/rooms/${id}/queue`);
      return data;
    },
    {
      onSuccess(queue) {
        setPlayQueue(queue);
      },
    },
  );
}
