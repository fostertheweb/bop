import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
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
  const {
    status: playlistsStatus,
    data,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetPlaylists(user);

  const playlists = data?.pages.flatMap((page) => page.data.items) || [];

  if (userStatus === "loading") {
    return "Fetching Spotify User Details";
  }

  if (playlistsStatus === "loading" && !isFetchingNextPage && user) {
    return `Fetching Spotify Playlists for ${user?.id}`;
  }

  return (
    <>
      <div className="sticky top-0 flex items-center justify-between w-full p-4 text-base text-gray-600 bg-white dark:bg-gray-800 dark:text-gray-200">
        <div className="flex items-center border-2 border-transparent">
          <div>
            <FontAwesomeIcon
              icon={faSpotify}
              className="mr-2 text-gray-500 fill-current dark:text-gray-400"
              size="lg"
            />
            <span>
              {user ? `${user.display_name}'s` : null} Spotify Playlists
            </span>
          </div>
        </div>
      </div>
      {user && playlistsStatus === "success" ? (
        <InfiniteScroll
          dataLength={playlists.length}
          next={() => fetchNextPage({ pageParam: playlists.length + 10 })}
          hasMore={true}
          scrollableTarget="outlet-container">
          <PlaylistsTable data={playlists} />
        </InfiniteScroll>
      ) : (
        <NotLoggedIn />
      )}
    </>
  );
}

function PlaylistsTable({ data }) {
  return data.map((playlist) => (
    <Disclosure as="div" key={playlist.id}>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex items-center justify-between w-full px-4 py-2 text-gray-700 hover:bg-blue-100 dark:text-gray-500 dark:hover:bg-gray-700">
            <div className="flex items-center gap-4 text-left">
              <div
                className="flex-shrink-0 w-16 h-16 bg-cover rounded"
                style={{
                  backgroundImage: `url(${playlist.images[0]?.url})`,
                }}></div>
              <div className="flex-grow">
                <div className="text-base text-gray-800 dark:text-gray-300">
                  {playlist.name}
                </div>
                <div
                  className="text-sm text-gray-600 dark:text-gray-400"
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
          <Disclosure.Panel className="text-gray-500 dark:text-gray-300">
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
      <div className="flex px-2 text-sm font-medium tracking-wide text-gray-700 dark:text-gray-400">
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
            className="flex items-center w-full px-2 text-sm text-gray-800 cursor-pointer dark:text-gray-200 hover:bg-purple-200 dark:hover:bg-gray-700"
            onClick={() => add(track)}>
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
