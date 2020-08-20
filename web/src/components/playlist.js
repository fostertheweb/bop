import React from "react";
import { useQuery } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinnerThird,
  faChevronLeft,
} from "@fortawesome/pro-solid-svg-icons";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useRemoteQueue } from "hooks/use-remote-queue";
import { useRecoilValue } from "recoil";
import { userAccessTokenAtom } from "hooks/use-login";

const { REACT_APP_SPOTIFY_API_BASE_URL: SPOTIFY_API_BASE_URL } = process.env;

export default function Playlist() {
  const userAccessToken = useRecoilValue(userAccessTokenAtom);
  const { addToQueue } = useRemoteQueue();
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const {
    state: { playlist },
  } = useLocation();
  const { id: room } = useParams();

  const { status, data: items } = useQuery("playlistTracks", [], async () => {
    const response = await fetch(
      `${SPOTIFY_API_BASE_URL}/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      },
    );
    const { items } = await response.json();
    return items;
  });

  return (
    <div>
      <div className="flex items-center justify-between p-4 text-gray-500">
        <button
          className="appearance-none cursor-pointer hover:text-gray-300 font-medium"
          onClick={() => navigate(`/rooms/${room}/playlists`)}>
          <FontAwesomeIcon
            icon={faChevronLeft}
            size="lg"
            className="fill-current mr-2"
          />
          Back
        </button>
        <h1 className="text-center text-gray-500 font-medium text-lg tracking-wide">
          {playlist.name}
        </h1>
        <span>&nbsp;</span>
      </div>
      <div>
        {status === "loading" ? (
          <FontAwesomeIcon icon={faSpinnerThird} />
        ) : (
          items.map((item) => (
            <div
              key={item.track.id}
              onClick={() => addToQueue(item.track)}
              className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-700 transition ease-in-out duration-150">
              <div className="">
                <img
                  src={item.track.album.images[2].url}
                  alt="album art"
                  className="shadow h-10 w-10"
                />
              </div>
              <div className="ml-4">
                <div className="text-gray-400">{item.track.name}</div>
                <div className="text-gray-500">
                  {item.track.artists.map(({ name }) => name).join(", ")}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}