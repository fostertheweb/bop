import { useRecoilValue } from "recoil";
import { useParams } from "react-router-dom";
import { displayNameState } from "atoms/display-name";
import { useWebSocket } from "hooks/use-websocket";
import { useQueue } from "hooks/use-queue";

export function useRemoteQueue() {
  const displayName = useRecoilValue(displayNameState);
  const { room } = useParams();
  const { addToQueue: updateQueue } = useQueue();
  const socket = useWebSocket(room, onMessage);

  function onMessage(event) {
    const { action, data, from } = JSON.parse(event.data);

    switch (action) {
      case "SONG_ADDED":
        updateQueue(data);
        break;
      default:
        console.log({ action });
        console.log({ data });
        console.log({ from });
        break;
    }
  }

  function addToQueue(item) {
    socket.send(
      JSON.stringify({
        action: "ADD_TO_QUEUE",
        data: item,
        from: displayName || "Anonymous",
      }),
    );
  }

  return { addToQueue };
}
