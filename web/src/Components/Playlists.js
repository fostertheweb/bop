import React from "react";
import { usePlaylists } from "../hooks/usePlaylists";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";

export default function Playlists() {
  const { status, playlists } = usePlaylists();

  return (
    <>
      <h1 className="p-4 text-gray-500 font-medium text-lg tracking-wide">Playlists</h1>
      <div>
        {status === "loading" ? (
          <FontAwesomeIcon icon={faSpinnerThird} />
        ) : (
          playlists.map(playlist => (
            <div className="p-4 text-gray-400 flex items-center">
              <div className="p-2">
                <img src={playlist.images[0].url} alt="playlist image" width="48" height="48" />
              </div>
              <div>
                <div>{playlist.name}</div>
                <div className="text-gray-600">{playlist.description}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
