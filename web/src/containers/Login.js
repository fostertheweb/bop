import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parse } from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { useLogin } from "hooks/use-login";

const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { code, redirect_uri, grant_type } = parse(location.search);
  const { login, status } = useLogin();

  useEffect(() => {
    if (code && redirect_uri && grant_type) {
      login(code, redirect_uri, grant_type);
    }

    if (status === "success") {
      navigate("/host/search");
    }
    // eslint-disable-next-line
  }, [code, redirect_uri, grant_type, status]);

  return (
    <div className="flex flex-col justify-center h-screen w-full items-center">
      <a
        href={`${API_BASE_URL}/login`}
        className="px-6 py-4 rounded-full bg-green-500 text-white leading hover:bg-green-600">
        {status === "pending" ? (
          <FontAwesomeIcon icon={faSpinnerThird} spin size="lg" />
        ) : (
          <FontAwesomeIcon icon={faSpotify} size="lg" />
        )}
        <span className="ml-2">Log in with Spotify</span>
      </a>
    </div>
  );
}
