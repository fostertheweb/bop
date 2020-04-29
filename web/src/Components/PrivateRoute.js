import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useSpotify } from "../hooks/useSpotify";

export function PrivateRoute({ element, ...rest }) {
  const { userCredentials } = useSpotify();
  if (userCredentials) {
    return <Route {...rest} element={element} />;
  } else {
    return <Navigate to="/login" />;
  }
}
