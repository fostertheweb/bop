import { useRecoilValue } from "recoil";
import { useParams } from "react-router-dom";
import { usernameState } from "atoms/username";
import useWebSocket from "react-use-websocket";
import { useQueue } from "hooks/use-queue";
import { useEffect } from "react";
import { useQuery } from "react-query";

const {
  REACT_APP_WEBSOCKET_API_URL: WEBSOCKET_API_URL,
  REACT_APP_API_BASE_URL: API_BASE_URL,
} = process.env;

export function useRemoteQueue() {
  const username = useRecoilValue(usernameState);
  const { id: room } = useParams();
  const { addToQueue: updateQueue } = useQueue();
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WEBSOCKET_API_URL);
  const { data } = useQuery(["room", room], async (_, id) => {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`);
    return await response.json();
  });

  useEffect(() => {
    if (lastJsonMessage) {
      const { action, data } = lastJsonMessage;

      switch (action) {
        case "SONG_ADDED":
          updateQueue(data);
          break;
        default:
          console.log(lastJsonMessage);
          break;
      }
    }
    //eslint-disable-next-line
  }, [lastJsonMessage]);

  function addToQueue(item) {
    if (data) {
      const [_, host] = data;
      if (username === host) {
        add(item);
      } else {
        songRequest(item);
      }
    }
  }

  function join() {
    sendJsonMessage({
      action: "JOIN",
      room,
      username: username,
    });
  }

  function add(item) {
    sendJsonMessage({
      action: "ADD_TO_QUEUE",
      room,
      data: item,
      username: username || "Anonymous",
    });
  }

  function songRequest(item) {
    sendJsonMessage({
      action: "SONG_REQUEST",
      room,
      data: item,
      username: username || "Anonymous",
    });
  }

  return { addToQueue, join };
}
