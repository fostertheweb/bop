import { useParams } from "react-router-dom";
import { useQueue } from "hooks/use-queue";
import { useSongRequests } from "hooks/use-song-requests";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useUserDetails } from "./use-user-details";
import { useUsername } from "hooks/use-username";
import { io } from "socket.io-client";

const {
  REACT_APP_WEBSOCKET_API_URL: WEBSOCKET_API_URL,
  REACT_APP_API_BASE_URL: API_BASE_URL,
} = process.env;

const sendJsonMessage = () => {};

export function useRemoteQueue() {
  const { data: userDetails } = useUserDetails();
  const { id } = useParams();
  const { addSongRequest } = useSongRequests();
  const { addToQueue: updateQueue } = useQueue();

  const { data: room } = useQuery(id && ["room", id], async () => {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`);
    return await response.json();
  });
  const username = useUsername();

  const socket = io(WEBSOCKET_API_URL);

  useEffect(() => {
    socket.emit("message", { yo: "hi" });
    //eslint-disable-next-line
  }, []);

  function addToQueue(item) {
    socket.emit("addToQueue");
    if (room) {
      if (userDetails && userDetails.id === room.host) {
        add(item);
      } else {
        songRequest(item);
      }
    }
  }

  function join() {
    sendJsonMessage({
      action: "JOIN",
      room: id,
      username: username,
    });
  }

  function add(item) {
    console.log(item);
    socket.emit("ADD_TO_QUEUE", {
      room: id,
      data: item,
      username: username || "Anonymous",
    });
  }

  function songRequest(item) {
    sendJsonMessage({
      action: "SONG_REQUEST",
      room: id,
      data: item,
      username: username || "Anonymous",
    });
  }

  return { addToQueue, join };
}
