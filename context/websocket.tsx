import { createContext, useEffect, useState } from "react";

const WebsocketContext = createContext(null);

export function WebsocketProvider({ children }) {
  const [data, setData] = useState(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const websocket = new WebSocket(
      "ws://localhost:10001/api/services/information"
    );

    websocket.onopen = () => {
      console.log("Connected to the WebSocket");
    };

    websocket.onmessage = (event) => {
      setData(event.data);
    };

    websocket.onclose = () => {
      console.log("Disconnected from the WebSocket");
      setWs(null);
    };

    setWs(websocket);

    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, []);

  return (
    <WebsocketContext.Provider value={data}>
      {children}
    </WebsocketContext.Provider>
  );
}
