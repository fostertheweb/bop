import React, { useContext, useEffect, useState } from "react";
import { useSpotify } from "./useSpotify";
import { useQuery } from "react-query";

export const PlaylistsContext = React.createContext("");

export function PlaylistsProvider({ children }) {
  const playlists = usePlaylistsProvider();
  return <PlaylistsContext.Provider value={playlists}>{children}</PlaylistsContext.Provider>;
}

export const usePlaylists = () => {
  return useContext(PlaylistsContext);
};

const SPOTIFY_API_URL = "https://api.spotify.com/v1";

export function usePlaylistsProvider() {
  const { userCredentials, userDetails } = useSpotify();
  console.log({ userDetails });
  const [cachedPlaylists, setPlaylistsCache] = useState([]);
  const { status, data } = useQuery(
    "playlists",
    [userCredentials, userDetails],
    async () => {
      const response = await fetch(`${SPOTIFY_API_URL}/users/${userDetails.id}/playlists`, {
        headers: {
          Authorization: `Bearer ${userCredentials.access_token}`,
        },
      });
      const { items } = await response.json();
      return items;
    },
    { retry: 3, retryDelay: 200 },
  );

  useEffect(() => {
    if (status === "success" && data) {
      setPlaylistsCache(data);
    }
  }, [data, status, userDetails]);

  return { status, playlists: cachedPlaylists };
}
