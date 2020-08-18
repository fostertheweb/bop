import React from "react";
import { useRecoilValue } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { useNavigate } from "react-router";
import { currentUserIdState } from "atoms/user-details";
import { useQuery } from "react-query";
import { userAccessTokenAtom } from "hooks/use-login";

const { REACT_APP_SPOTIFY_API_BASE_URL: SPOTIFY_API_BASE_URL } = process.env;

export default function Playlists() {
  const userId = useRecoilValue(currentUserIdState);
  const userAccessToken = useRecoilValue(userAccessTokenAtom);
  const navigate = useNavigate();
  const { status, data } = useQuery("playlists", async () => {
    const response = await fetch(
      `${SPOTIFY_API_BASE_URL}/users/${userId}/playlists`,
      {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      },
    );
    return await response.json();
  });

  return (
    <>
      <h1 className="p-4 text-gray-500 font-medium text-lg tracking-wide">
        Playlists
      </h1>
      <div>
        {status === "loading" ? (
          <FontAwesomeIcon icon={faSpinnerThird} />
        ) : (
          data.items.map((playlist) => (
            <div
              onClick={() =>
                navigate(`${playlist.id}`, { state: { playlist } })
              }
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
