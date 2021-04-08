import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { useLoginUrl } from "hooks/use-login";

export function LoginButton({ loading }) {
  const url = useLoginUrl(window.location.href);

  return (
    <a
      href={url}
      className="px-6 py-4 font-medium text-center text-white bg-green-500 rounded-md leading hover:bg-green-600">
      {loading ? (
        <FontAwesomeIcon icon={faSpinnerThird} spin size="lg" />
      ) : (
        <FontAwesomeIcon icon={faSpotify} size="lg" />
      )}
      <span className="ml-2">Log in with Spotify</span>
    </a>
  );
}
