import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/pro-solid-svg-icons";
import { useUserDetails } from "hooks/use-user-details";
import { usePlaylists } from "hooks/use-playlists";
import { Disclosure } from "@headlessui/react";
import { useQuery } from "react-query";
import Axios from "axios";
import { useRecoilValue } from "recoil";
import { userAccessTokenState } from "hooks/use-login";
import { useQueue } from "hooks/use-queue";
import { LoginButton } from "components/spotify/login-button";
import { faUserLock } from "@fortawesome/pro-duotone-svg-icons";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";

const { REACT_APP_SPOTIFY_API_URL: SPOTIFY_API_URL } = process.env;

export default function Playlists() {
  const { data: user, status: userStatus } = useUserDetails();
  const { status: playlistsStatus, data: playlists } = usePlaylists(user);

  if (userStatus === "loading") {
    return "Fetching Spotify User Details";
  }

  if (playlistsStatus === "loading") {
    return `Fetching Spotify Playlists for ${user.id}`;
  }

  return (
    <>
      <div className="sticky top-0 flex items-center justify-between w-full p-4 text-base text-gray-600 bg-white">
        <div className="flex items-center border-2 border-transparent">
          <div>
            <FontAwesomeIcon
              icon={faSpotify}
              className="mr-2 text-gray-500 fill-current"
              size="lg"
            />
            <span>{user ? `${user.id}'s` : null} Spotify Playlists</span>
          </div>
        </div>
      </div>
      {user ? <PlaylistsTable data={playlists.items} /> : <NotLoggedIn />}
    </>
  );
}

function PlaylistsTable({ data }) {
  return data.map((row) => (
    <Disclosure as="div" className="w-full pl-1">
      {({ open }) => (
        <>
          <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-gray-700 hover:bg-blue-100 w-full">
            <div className="flex items-center text-left">
              <div
                className="flex-shrink-0 w-16 h-16 bg-cover rounded"
                style={{
                  backgroundImage: `url(${row.images[0].url})`,
                }}></div>
              <div className="ml-4">
                <div className="text-base text-gray-800">{row.name}</div>
                <div
                  className="text-sm text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: row.description,
                  }}></div>
              </div>
            </div>
            <FontAwesomeIcon
              icon={faChevronRight}
              className={`${open ? "transform rotate-90" : ""} w-5 h-5 `}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
            <SubRowAsync row={row} />
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  ));
}

function SubRowAsync({ row }) {
  const { add } = useQueue();
  const { id } = row;
  const userAccessToken = useRecoilValue(userAccessTokenState);
  const { data, status } = useQuery(id && ["playlist", id], async () => {
    const { data } = await Axios.get(
      `${SPOTIFY_API_URL}/playlists/${id}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      },
    );
    return data.items.map((i) => i.track);
  });

  if (status === "loading" || !data) {
    return "Loading...";
  }

  // Render the UI for your table
  return (
    <>
      <div className="flex text-xs text-gray-700">
        <div style={{ width: "30%" }} className="p-1 font-medium">
          Name
        </div>
        <div style={{ width: "30%" }} className="p-1 font-medium">
          Artist
        </div>
        <div style={{ width: "30%" }} className="p-1 font-medium">
          Album
        </div>
        <div style={{ width: "10%" }} className="p-1 font-medium">
          Duration
        </div>
      </div>
      {data.map((track, i) => {
        return (
          <div
            key={`${track.id}-expanded-${i}`}
            className="flex items-center w-full text-xs text-gray-800 cursor-pointer hover:bg-purple-200"
            onClick={() => add(track.id)}>
            <div style={{ width: "30%" }} className="p-1 truncate">
              {track.name}
            </div>
            <div style={{ width: "30%" }} className="p-1 truncate">
              {track.artists[0].name}
            </div>
            <div style={{ width: "30%" }} className="p-1 truncate">
              {track.album.name}
            </div>
            <div style={{ width: "10%" }} className="p-1">
              {millisToMinutesAndSeconds(track.duration_ms)}
            </div>
          </div>
        );
      })}
    </>
  );
}

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

function NotLoggedIn() {
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
          Login with your Spotify account to view your Playlists and save songs
          you like.
        </div>
        <div className="w-full">
          <LoginButton />
        </div>
      </div>
    </div>
  );
}
