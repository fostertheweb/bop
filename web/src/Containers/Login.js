import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parse } from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { useAccessStorage } from "../hooks/useAccessStorage";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = parse(location.search);

  const { storeTokens } = useAccessStorage();

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
        storeTokens({ code: query.code, access_token, refresh_token });

        navigate("/host/search");
      } catch (err) {
        console.error(err);
      }
    }

    if (query.code && query.redirect_uri) {
      getSpotifyCredentials();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col justify-center h-screen w-full items-center">
      <a
        href="http://localhost:4000/login"
        className="px-6 py-4 rounded-full bg-green-500 text-white leading hover:bg-green-600">
        <FontAwesomeIcon icon={faSpotify} size="lg" />
        <span className="ml-2">Log in with Spotify</span>
      </a>
    </div>
  );
}
