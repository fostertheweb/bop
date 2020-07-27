import { useEffect, useRef } from "react";

const { REACT_APP_WEBSOCKET_API_URL: WEBSOCKET_API_URL } = process.env;

export function useWebSocket(room, handler) {
  const webSocketRef = useRef(null);

  useEffect(() => {
    const webSocket = new WebSocket(`${WEBSOCKET_API_URL}/rooms/${room}`);
    webSocket.onmessage = handler;
    webSocketRef.current = webSocket;
    //eslint-disable-next-line
  }, []);

  return webSocketRef.current;
}
