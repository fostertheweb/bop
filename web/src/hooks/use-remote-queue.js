import { useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { useQueue } from "hooks/use-queue";
import { useSongRequests } from "hooks/use-song-requests";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useUserDetails } from "./use-user-details";
import { useUsername } from "hooks/use-username";

const {
  REACT_APP_WEBSOCKET_API_URL: WEBSOCKET_API_URL,
  REACT_APP_API_BASE_URL: API_BASE_URL,
} = process.env;

export function useRemoteQueue() {
  const { data: userDetails } = useUserDetails();
  const { id } = useParams();
  const { addSongRequest } = useSongRequests();
  const { addToQueue: updateQueue } = useQueue();
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WEBSOCKET_API_URL);
  const { data: room } = useQuery(id && ["room", id], async () => {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`);
    return await response.json();
  });
  const username = useUsername();

  useEffect(() => {
    if (lastJsonMessage) {
      const { action, data } = lastJsonMessage;

      switch (action) {
        case "SONG_ADDED":
          updateQueue(data);
          break;
        case "SONG_REQUEST":
          addSongRequest(data);
          break;
        default:
          console.log(lastJsonMessage);
          break;
      }
    }
    //eslint-disable-next-line
  }, [lastJsonMessage]);

  function addToQueue(item) {
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
    sendJsonMessage({
      action: "ADD_TO_QUEUE",
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
