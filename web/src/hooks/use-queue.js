import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { io } from "socket.io-client";
import { useRoomId } from "./use-rooms";
import { useEffect, useRef } from "react";
import { useSetCurrentPlayback } from "./use-current-playback";
import { useSetIsPlaybackLoading, useSetIsPlaying } from "./use-player";
import { useParams } from "react-router";
import { useQuery, useQueryCache } from "react-query";
import axios from "axios";

const { REACT_APP_API_URL: API_URL } = process.env;

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
    const socket = io(API_URL, {
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
      setIsPlaying(false);
      playNext();
    });

    socket.on("QUEUE_UPDATED", () => {
      queryCache.refetchQueries(["playQueue", roomId]);
    });

    socketRef.current = socket;
    // eslint-disable-next-line
  }, []);

  function add(track) {
    socketRef.current.emit("ADD_TO_QUEUE", track.id);
    queryCache.setQueryData(["getTrack", track.id], track);
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
      const { data } = await axios.get(`${API_URL}/rooms/${id}/queue`);
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

export const queueDurationState = atom({
  key: "crowdQ.queueDuration",
  default: 0,
});

export function useQueueDuration() {
  return useRecoilValue(queueDurationState);
}

export function useSetQueueDuration() {
  return useSetRecoilState(queueDurationState);
}
