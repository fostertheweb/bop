import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { useLoginUrl, useSetRedirectTo } from "hooks/use-login";

export function LoginButton() {
  const url = useLoginUrl();
  const setRedirectTo = useSetRedirectTo();

  useEffect(() => {
    setRedirectTo(`${window.location.pathname}`);
    //eslint-disable-next-line
  }, []);

  return (
    <a
      href={url}
      className="flex items-center justify-center gap-2 px-6 py-4 font-medium text-center text-white bg-green-500 rounded-md leading hover:bg-green-600">
      <FontAwesomeIcon icon={faSpotify} size="lg" />
      <span>Log in with Spotify</span>
    </a>
  );
}
