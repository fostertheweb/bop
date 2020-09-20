import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { userAccessTokenState } from "hooks/use-login";
import { useSetIsPlaying } from "hooks/use-player";
import axios from "axios";

const { REACT_APP_SPOTIFY_API_BASE_URL: SPOTIFY_API_BASE_URL } = process.env;

export function useCurrentPlayback() {
  const userAccessToken = useRecoilValue(userAccessTokenState);
  const setIsPlaying = useSetIsPlaying();

  return useQuery(
    "currentPlayback",
    async () => {
      const { data } = await axios.get(`${SPOTIFY_API_BASE_URL}/me/player`, {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      });
      console.log({ currentPlayback: data });
      return data;
    },
    {
      onSuccess({ is_playing }) {
        setIsPlaying(is_playing);
      },
      onError(err) {
        console.error(err);
      },
    },
  );
}
