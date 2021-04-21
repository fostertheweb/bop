import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoginButton } from "components/spotify/login-button";
import { faUserLock } from "@fortawesome/pro-duotone-svg-icons";

export default function NotLoggedIn() {
  return (
    <div className="flex items-center justify-center flex-grow text-gray-600">
      <div
        className="flex flex-col items-center gap-4 p-8"
        style={{ width: "24rem" }}>
        <FontAwesomeIcon
          icon={faUserLock}
          className="text-gray-500 fill-current"
          size="4x"
        />

        <h3 className="text-lg font-medium text-gray-700">
          Not logged in to Spotify
        </h3>

        <div className="mt-4 text-gray-700">
          Login with your Spotify account to view your Playlists, Liked Songs
          and save songs you like.
        </div>
        <div className="w-full">
          <LoginButton />
        </div>
      </div>
    </div>
  );
}
