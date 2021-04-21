import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/pro-solid-svg-icons";
import { useUserDetails } from "hooks/spotify/use-user-details";
import {
  useGetPlaylists,
  useGetPlaylistTracks,
} from "hooks/spotify/use-playlists";
import { Disclosure } from "@headlessui/react";
import { useQueue } from "hooks/use-queue";
import NotLoggedIn from "components/spotify/not-logged-in";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";

export default function Playlists() {
  const { data: user, status: userStatus } = useUserDetails();
  const { status: playlistsStatus, data: playlists } = useGetPlaylists(user);

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
  return data.map((playlist) => (
    <Disclosure as="div" className="">
      {({ open }) => (
        <>
          <Disclosure.Button className="flex items-center justify-between w-full px-4 py-2 text-gray-700 hover:bg-blue-100">
            <div className="flex items-center gap-4 text-left">
              <div
                className="flex-shrink-0 w-16 h-16 bg-cover rounded"
                style={{
                  backgroundImage: `url(${playlist.images[0].url})`,
                }}></div>
              <div className="flex-grow">
                <div className="text-base text-gray-800">{playlist.name}</div>
                <div
                  className="text-sm text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: playlist.description,
                  }}></div>
              </div>
            </div>
            <FontAwesomeIcon
              icon={faChevronRight}
              className={`${open ? "transform rotate-90" : ""} w-5 h-5 `}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="text-gray-500">
            <Tracks data={playlist} />
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  ));
}

function Tracks({ data }) {
  const { add } = useQueue();
  const { id } = data;
  const { data: tracks, status } = useGetPlaylistTracks(id);

  if (status === "loading" || !tracks) {
    return "Loading...";
  }

  return (
    <>
      <div className="flex px-2 text-sm font-bold tracking-wide text-gray-700">
        <div style={{ width: "30%" }} className="p-1">
          Name
        </div>
        <div style={{ width: "30%" }} className="p-1">
          Artist
        </div>
        <div style={{ width: "30%" }} className="p-1">
          Album
        </div>
        <div style={{ width: "10%" }} className="p-1">
          Duration
        </div>
      </div>
      {tracks.map((track, i) => {
        return (
          <div
            key={`${track.id}-expanded-${i}`}
            className="flex items-center w-full px-2 text-sm text-gray-800 cursor-pointer hover:bg-purple-200"
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
