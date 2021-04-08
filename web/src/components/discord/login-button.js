import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { faDiscord, faSpotify } from "@fortawesome/free-brands-svg-icons";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { useLoginUrl } from "hooks/use-login";

export function LoginButton({ loading, redirect_uri }) {
  const url = useLoginUrl(redirect_uri);

  return (
    <a
      href={url}
      className="px-6 py-4 font-medium text-center text-white bg-indigo-300 rounded-md leading hover:bg-indigo-400">
      {loading ? (
        <FontAwesomeIcon icon={faSpinnerThird} spin size="lg" />
      ) : (
        <FontAwesomeIcon icon={faDiscord} size="lg" />
      )}
      <span className="ml-2">Log in with Discord</span>
    </a>
  );
}
