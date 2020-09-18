import { useQuery, useQueryCache } from "react-query";
import axios from "axios";
import { userAccessTokenAtom, userRefreshTokenAtom } from "./use-login";
import { useRecoilValue } from "recoil";

const { REACT_APP_SPOTIFY_API_BASE_URL: SPOTIFY_API_BASE_URL } = process.env;

export function useSpotifyQuery(path) {
  const userAccessToken = useRecoilValue(userAccessTokenAtom);
  const userRefreshToken = useRecoilValue(userRefreshTokenAtom);
  const queryCache = useQueryCache();

  return useQuery(
    path,
    async () => {
      const { tracks } = await axios.get(SPOTIFY_API_BASE_URL + path, {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      });
      return tracks;
    },
    {
      onError(err) {
        console.error(err);
        queryCache.refetchQueries();
      },
    },
  );
}
