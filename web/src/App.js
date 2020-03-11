import React from "react";
import "./App.css";
import { useSpotify } from "./hooks/use-spotify";

function App() {
  const { search } = useSpotify();
  React.useEffect(() => {
    search("john mayer");
  }, []);

  const login = () => {};
  return (
    <div className="App">
      <a href="http://localhost:4000/login">login</a>
    </div>
  );
}

export default App;
