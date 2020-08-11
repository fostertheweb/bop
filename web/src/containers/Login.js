import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parse } from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { useLogin } from "hooks/use-login";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { code } = parse(location.search);
  const { login, redirect, status } = useLogin();
  const redirect_uri = `${window.location.origin}${window.location.pathname}`;
  const spotify = redirect(redirect_uri);

  useEffect(() => {
    if (code && status === "idle") {
      login(code, redirect_uri);
    }

    if (status === "success") {
      navigate("/host");
    }
    // eslint-disable-next-line
  }, [code, status]);

  return (
    <div className="flex flex-col justify-center h-screen w-full items-center">
      <a
        href={spotify}
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
