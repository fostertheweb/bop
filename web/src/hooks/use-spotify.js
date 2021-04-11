import { useQuery, useQueryCache } from "react-query";
import axios from "axios";
import { userAccessTokenState, userRefreshTokenState } from "./use-login";
import { useRecoilValue } from "recoil";

const {
  REACT_APP_API_BASE_URL: API_BASE_URL,
  REACT_APP_SPOTIFY_API_BASE_URL: SPOTIFY_API_BASE_URL,
} = process.env;

export function useGetSpotifyCredentials() {
  return useQuery("clientAccessToken", async () => {
    const { data } = await axios.get(`${API_BASE_URL}/spotify/authorize`);
    return data;
  });
}

export function useSpotifyQuery(path) {
  const userAccessToken = useRecoilValue(userAccessTokenState);
  // const userRefreshToken = useRecoilValue(userRefreshTokenAtom);
  // const queryCache = useQueryCache();

  return useQuery(
    path,
    async () => {
      const { data } = await axios.get(SPOTIFY_API_BASE_URL + path, {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      });
      return data;
    },
    {
      onError(err) {
        console.error(err);
      },
    },
  );
}

export function useSpotifyMutation(path) {
  const userAccessToken = useRecoilValue(userAccessTokenState);
  // const userRefreshToken = useRecoilValue(userRefreshTokenAtom);
  // const queryCache = useQueryCache();

  return useQuery(
    async () => {
      const { data } = await axios.put(SPOTIFY_API_BASE_URL + path, {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      });
      return data;
    },
    {
      onError(err) {
        console.error(err);
      },
    },
  );
}
