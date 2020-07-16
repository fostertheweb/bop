import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router } from "react-router-dom";

import "typeface-cabin";
import "typeface-catamaran";
import "typeface-londrina-solid";

import "./styles.css";
import "./index.css";

ReactDOM.render(
  <Router>
    <App className="cq-bg-dark h-full" />
  </Router>,
  document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
