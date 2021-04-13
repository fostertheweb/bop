import { useEffect } from "react";
import { useQuery } from "react-query";
import { userAccessTokenState } from "hooks/use-login";
import { atom, selector, useRecoilValue } from "recoil";

const { REACT_APP_SPOTIFY_API_URL: SPOTIFY_API_URL } = process.env;

export const currentDeviceAtom = atom({
  key: "crowdQ.storage.currentDevice",
  default: null,
  persistence_UNSTABLE: true,
});

export const devicesQuery = selector({
  key: "crowdQ.devices",
  get: async ({ get }) => {
    const token = get(userAccessTokenState);
    const response = await fetch(`${SPOTIFY_API_URL}/me/player/devices`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  },
});

export function useDevices() {
  const token = useRecoilValue(userAccessTokenState);
  const { status, data, refetch } = useQuery(
    "devices",
    [token],
    async () => {
      const response = await fetch(
        "https://api.spotify.com/v1/me/player/devices",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const { devices } = await response.json();
      return devices;
    },
    { retry: 3 },
  );

  useEffect(() => {
    refetch();
  }, [token, refetch]);

  return { status, devices: data };
}

// TODO
// - resume music on newly selected device if currently playing
