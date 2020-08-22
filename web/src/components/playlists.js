import React from "react";
import { selector, useRecoilValue, useRecoilValueLoadable } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { useNavigate } from "react-router";
import { currentUserIdState, userDetailsSelector } from "atoms/user-details";
import { useQuery } from "react-query";
import { userAccessTokenAtom } from "hooks/use-login";

const { REACT_APP_SPOTIFY_API_BASE_URL: SPOTIFY_API_BASE_URL } = process.env;

const playlistsQuery = selector({
  key: "crowdQ.playlists",
  get: async ({ get }) => {
    const userAccessToken = get(userAccessTokenAtom);
    const { id } = get(userDetailsSelector);

    if (userAccessToken) {
      const response = await fetch(
        `${SPOTIFY_API_BASE_URL}/users/${id}/playlists`,
        {
          headers: {
            Authorization: `Bearer ${userAccessToken}`,
          },
        },
      );
      const json = await response.json();

      if (response.ok) {
        return json;
      }

      throw json;
    }

    return null;
  },
});

export default function Playlists() {
  const { state, contents } = useRecoilValueLoadable(playlistsQuery);
  const navigate = useNavigate();

  return (
    <>
      <h1 className="p-4 text-gray-500 font-medium text-lg tracking-wide">
        Playlists
      </h1>
      <div>
        {state === "loading" ? (
          <FontAwesomeIcon icon={faSpinnerThird} />
        ) : (
          contents?.items?.map((playlist) => (
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
