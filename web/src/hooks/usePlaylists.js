import React, { useEffect, useState } from "react";
import { useSpotify } from "./useSpotify";
import { useQuery } from "react-query";

// export const DeviceContext = React.createContext("");

// export function DeviceProvider({ children }) {
//   const devices = useDevicesProvider();
//   return <DeviceContext.Provider value={devices}>{children}</DeviceContext.Provider>;
// }

// export const usePlaylists = () => {
//   return useContext(DeviceContext);
// };

export function usePlaylists() {
  const { userCredentials, userDetails } = useSpotify();
  const [cachedPlaylists, setPlaylistsCache] = useState([]);
  const { status, data } = useQuery("playlists", [userCredentials.access_token], async () => {
    const response = await fetch(`${url}/users/${userDetails.user_id}/playlists`, {
      headers: {
        Authorization: `Bearer ${userCredentials.access_token}`,
      },
    });
    const { playlists } = await response.json();
    return playlists;
  });

  useEffect(() => {
    if (status === "success" && data) {
      setPlaylistsCache(data);
    }
  }, [data, status]);

  return { status, playlists: cachedPlaylists };
}
