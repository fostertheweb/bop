import { useQuery } from "react-query";
import axios from "axios";
import { userAccessTokenState } from "hooks/spotify/use-login";
import { useRecoilValue } from "recoil";

const {
  REACT_APP_API_URL: API_URL,
  REACT_APP_SPOTIFY_API_URL: SPOTIFY_API_URL,
} = process.env;

export function useGetSpotifyCredentials() {
  return useQuery("clientAccessToken", async () => {
    const { data } = await axios.get(`${API_URL}/spotify/authorize`);
    return data;
  });
}

export function useSpotifyClientQuery(path) {
  const userAccessToken = useRecoilValue(userAccessTokenState);
  // const userRefreshToken = useRecoilValue(userRefreshTokenAtom);
  // const queryCache = useQueryCache();

  return useQuery(
    path,
    async () => {
      const { data } = await axios.get(SPOTIFY_API_URL + path, {
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

export function useSpotifyUserQuery(path) {
  const userAccessToken = useRecoilValue(userAccessTokenState);
  // const userRefreshToken = useRecoilValue(userRefreshTokenAtom);
  // const queryCache = useQueryCache();

  return useQuery(
    path,
    async () => {
      const { data } = await axios.get(SPOTIFY_API_URL + path, {
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

export function useSpotifyUserMutation(path) {
  const userAccessToken = useRecoilValue(userAccessTokenState);
  // const userRefreshToken = useRecoilValue(userRefreshTokenAtom);
  // const queryCache = useQueryCache();

  return useQuery(
    async () => {
      const { data } = await axios.put(SPOTIFY_API_URL + path, {
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
