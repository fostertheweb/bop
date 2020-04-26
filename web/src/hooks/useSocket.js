import React, { useEffect, useState, useReducer } from "react";
import io from "socket.io-client";

const socket = io(`http://localhost:4000`);

function useSocketProvider() {
  useEffect(() => {
    socket.on("clap", payload => {
      console.log({ payload });
    });
    socket.on("joined", payload => {
      console.log({ payload });
    });

    socket.on("addToQueue", payload => {
      dispatch({ type: "addToQueue", payload });
    });
  }, []);

  useEffect(() => {
    socket.emit("queueUpdated", { room: user.id, payload: queue });
  }, [queue, user.id]);

  return {};
}
