import { useEffect, useRef } from "react";
import io from "socket.io-client";

const { REACT_APP_WEBSOCKET_API_URL: WEBSOCKET_API_URL } = process.env;

export function useWebSocket(room) {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(`${WEBSOCKET_API_URL}?room=${room}`);
  }, []);

  return socketRef.current;
}
