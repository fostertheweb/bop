import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { useUsername } from "hooks/use-username";
import { io } from "socket.io-client";
import { useRoom, useRoomId } from "./use-rooms";
import { useEffect, useRef } from "react";
import { useSetCurrentPlayback } from "./use-current-playback";
import { useIsPlaying, useSetIsPlaying } from "./use-player";
import { useParams } from "react-router";
import { useQuery, useQueryCache } from "react-query";
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
  const playQueue = usePlayQueue();
  const setCurrentPlayback = useSetCurrentPlayback();
  const isPlaying = useIsPlaying();
  const setIsPlaying = useSetIsPlaying();
  const socketRef = useRef(null);
  const queryCache = useQueryCache();
  const roomId = useRoomId();

  useEffect(() => {
    const socket = io(WEBSOCKET_API_URL);

    socket.on("PLAYBACK_START", (currentPlayback) => {
      setCurrentPlayback(currentPlayback);
      setIsPlaying(true);
      queryCache.refetchQueries(["playQueue", roomId]);
    });

    socket.on("PLAYBACK_END", () => {
      next();
    });

    socketRef.current = socket;
    // eslint-disable-next-line
  }, []);

  function add(trackId) {
    socketRef.current.emit("ADD_TO_QUEUE", {
      room_id: roomId,
      track_id: trackId,
      username: username || "Anonymous",
    });
    queryCache.refetchQueries(["playQueue", roomId]);
  }

  function remove(trackId) {
    socketRef.current.emit("REMOVE_FROM_QUEUE", {
      room_id: roomId,
      track_id: trackId,
      username: username || "Anonymous",
    });
    queryCache.refetchQueries(["playQueue", roomId]);
  }

  function play(trackId) {
    socketRef.current.emit("PLAY_SONG", {
      room_id: roomId,
      track_id: trackId,
    });
    queryCache.refetchQueries(["playQueue", roomId]);
  }

  function next() {
    socketRef.current.emit("PLAY_SONG", {
      room_id: roomId,
    });
    queryCache.refetchQueries(["playQueue", roomId]);
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
      onError(err) {
        console.error(err);
      },
    },
  );
}
