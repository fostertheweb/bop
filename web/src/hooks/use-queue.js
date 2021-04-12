import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { io } from "socket.io-client";
import { useRoomId } from "./use-rooms";
import { useEffect, useRef } from "react";
import { useSetCurrentPlayback } from "./use-current-playback";
import { useSetIsPlaybackLoading, useSetIsPlaying } from "./use-player";
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
  const setCurrentPlayback = useSetCurrentPlayback();
  const setIsPlaying = useSetIsPlaying();
  const socketRef = useRef(null);
  const queryCache = useQueryCache();
  const roomId = useRoomId();
  const setIsPlaybackLoading = useSetIsPlaybackLoading();

  useEffect(() => {
    const socket = io(WEBSOCKET_API_URL, {
      query: {
        room_id: roomId,
      },
    });

    socket.on("PLAYBACK_START", (currentPlayback) => {
      setIsPlaybackLoading(false);
      setCurrentPlayback(currentPlayback);
      setIsPlaying(true);
      queryCache.refetchQueries(["playQueue", roomId]);
    });

    socket.on("PLAYBACK_END", () => {
      playNext();
    });

    socketRef.current = socket;
    // eslint-disable-next-line
  }, []);

  function add(trackId) {
    socketRef.current.emit("ADD_TO_QUEUE", trackId);
    queryCache.refetchQueries(["playQueue", roomId]);
  }

  function remove(trackId) {
    socketRef.current.emit("REMOVE_FROM_QUEUE", trackId);
    queryCache.refetchQueries(["playQueue", roomId]);
  }

  function playNext() {
    setIsPlaybackLoading(true);
    socketRef.current.emit("PLAY_NEXT");
    queryCache.refetchQueries(["playQueue", roomId]);
  }

  return { add, remove, playNext };
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
