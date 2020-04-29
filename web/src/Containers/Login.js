import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parse } from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { useSpotify } from "../hooks/useSpotify";

const API_BASE_URL = "http://localhost:4000";

export default function Login() {
  const { userCredentials, fetchUserCredentials, refreshUserAccessToken } = useSpotify();
  const location = useLocation();
  const navigate = useNavigate();
  const query = parse(location.search);

  useEffect(() => {
    if (query.code && query.redirect_uri) {
      fetchUserCredentials(query);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (userCredentials) {
      refreshUserAccessToken();
      navigate("/host/search");
    }
    // eslint-disable-next-line
  }, [userCredentials]);

  return (
    <div className="flex flex-col justify-center h-screen w-full items-center">
      <a
        href={`${API_BASE_URL}/login`}
        className="px-6 py-4 rounded-full bg-green-500 text-white leading hover:bg-green-600">
        <FontAwesomeIcon icon={faSpotify} size="lg" />
        <span className="ml-2">Log in with Spotify</span>
      </a>
    </div>
  );
}
