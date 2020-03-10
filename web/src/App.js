import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { useSpotify } from "./hooks/use-spotify";

function App() {
  const { search } = useSpotify();
  React.useEffect(() => {
    search("john mayer");
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
