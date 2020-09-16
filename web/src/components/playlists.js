import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { useUserDetails } from "hooks/use-user-details";
import { usePlaylists } from "hooks/use-playlists";

export default function Playlists() {
  const { data: userDetails } = useUserDetails();
  const { isFetching: loading, data: playlists } = usePlaylists(userDetails);

  return (
    <>
      <h1 className="p-4 cq-text-white font-medium text-lg tracking-wide">
        Playlists
      </h1>
      <div>
        {loading ? (
          <FontAwesomeIcon icon={faSpinnerThird} spin />
        ) : (
          playlists?.items?.map((playlist) => (
            <PlaylistListItem playlist={playlist} />
          ))
        )}
      </div>
    </>
  );
}

function PlaylistListItem({ playlist }) {
  return (
    <div
      onClick={() => console.log(playlist.id)}
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
  );
}
