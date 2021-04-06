import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useUsername } from "hooks/use-username";
import { io } from "socket.io-client";

const {
  REACT_APP_WEBSOCKET_API_URL: WEBSOCKET_API_URL,
  REACT_APP_API_BASE_URL: API_BASE_URL,
} = process.env;

export function useRemoteQueue() {
  const { id } = useParams();

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
    console.log(item);
    socket.emit("ADD_TO_QUEUE", {
      room,
      data: item,
      username: username || "Anonymous",
    });
  }

  function join() {
    socket.emit("JOIN", {
      room,
      username: username || "Anonymous",
    });
  }

  return { addToQueue, join };
}
