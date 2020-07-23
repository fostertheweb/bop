import { useRecoilValue } from "recoil";
import { useParams } from "react-router-dom";
import { displayNameState } from "atoms/display-name";
import { useWebSocket } from "hooks/use-websocket";

export function useRemoteQueue() {
  const displayName = useRecoilValue(displayNameState);
  const { room } = useParams();
  const socket = useWebSocket(room);

  function addToQueue(item) {
    socket.emit("ADD_TO_QUEUE", {
      data: item,
      room,
      from: displayName || "Anonymous",
    });
  }

  return { addToQueue };
}
