import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parse } from "query-string";
import useAccessStorage from "../hooks/useAccessStorage";

export default function() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = parse(location.search);

  const { setAccessKeys } = useAccessStorage();

  useEffect(() => {
    async function getSpotifyCredentials() {
      try {
        const response = await fetch("http://localhost:4000/login", {
          method: "POST",
          body: JSON.stringify(query),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const { access_token, refresh_token } = await response.json();
        setAccessKeys({ code: query.code, access_token, refresh_token });

        navigate("/host");
      } catch (err) {
        console.error(err);
      }
    }

    if (query.code && query.redirect_uri) {
      console.log("getting access and refresh tokens");
      getSpotifyCredentials();
    }
    // eslint-ignore-next-line
  }, [query, navigate, setAccessKeys]);

  return (
    <div className="App">
      <a href="http://localhost:4000/login">Log in with Spotify</a>
    </div>
  );
}
