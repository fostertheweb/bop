import { useRecoilValue } from "recoil";
import { useParams } from "react-router-dom";
import { usernameState } from "atoms/username";
import useWebSocket from "react-use-websocket";
import { useQueue } from "hooks/use-queue";
import { useEffect } from "react";

const { REACT_APP_WEBSOCKET_API_URL: WEBSOCKET_API_URL } = process.env;

export function useRemoteQueue() {
  const username = useRecoilValue(usernameState);
  const { id: room } = useParams();
  const { addToQueue: updateQueue } = useQueue();
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WEBSOCKET_API_URL);

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

  function join() {
    sendJsonMessage({
      action: "JOIN",
      room,
      username: username,
    });
  }

  function addToQueue(item) {
    sendJsonMessage({
      action: "ADD_TO_QUEUE",
      room,
      data: item,
      username: username || "Anonymous",
    });
  }

  return { addToQueue, join };
}
