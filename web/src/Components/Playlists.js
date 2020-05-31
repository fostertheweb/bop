import React from "react";
import { usePlaylists } from "../hooks/usePlaylists";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { useNavigate } from "react-router";

export default function Playlists() {
  const { status, playlists } = usePlaylists();
  const navigate = useNavigate();

  return (
    <>
      <h1 className="p-4 text-gray-500 font-medium text-lg tracking-wide">Playlists</h1>
      <div>
        {status === "loading" ? (
          <FontAwesomeIcon icon={faSpinnerThird} />
        ) : (
          playlists.map(playlist => (
            <div
              onClick={() => navigate(`${playlist.id}`)}
              className="p-4 text-gray-400 flex items-center cursor-pointer hover:bg-gray-700 transition ease-in-out duration-150">
              <div
                className="h-16 w-16 bg-cover flex-shrink-0"
                style={{
                  backgroundImage: `url(${playlist.images[0].url})`,
                }}></div>
              <div className="truncate flex-shrink ml-4">
                <div className="text-base truncate">{playlist.name}</div>
                <div className="truncate">{playlist.description}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
