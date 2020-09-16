import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { useLoginUrl } from "hooks/use-login";

export function LoginButton({ loading, redirect_uri }) {
  const url = useLoginUrl(redirect_uri);

  return (
    <a
      href={url}
      className="px-6 py-4 rounded-full bg-green-500 text-white leading hover:bg-green-600">
      {loading ? (
        <FontAwesomeIcon icon={faSpinnerThird} spin size="lg" />
      ) : (
        <FontAwesomeIcon icon={faSpotify} size="lg" />
      )}
      <span className="ml-2">Log in with Spotify</span>
    </a>
  );
}
