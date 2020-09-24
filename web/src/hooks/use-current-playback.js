import { useQuery } from "react-query";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { userAccessTokenState } from "hooks/use-login";
import { useSetIsPlaying } from "hooks/use-player";
import axios from "axios";

const { REACT_APP_SPOTIFY_API_BASE_URL: SPOTIFY_API_BASE_URL } = process.env;

const currentPlaybackState = atom({
  key: "crowdQ.currentPlayback",
  default: null,
});

export function useCurrentPlayback() {
  return useRecoilValue(currentPlaybackState);
}

export function useSetCurrentPlayback() {
  return useSetRecoilState(currentPlaybackState);
}

export function useGetCurrentPlayback() {
  const userAccessToken = useRecoilValue(userAccessTokenState);
  const setIsPlaying = useSetIsPlaying();
  const setCurrentPlayback = useSetCurrentPlayback();

  return useQuery(
    "currentPlayback",
    async () => {
      const { data } = await axios.get(
        `${SPOTIFY_API_BASE_URL}/me/player/currently-playing`,
        {
          headers: {
            Authorization: `Bearer ${userAccessToken}`,
          },
        },
      );
      return data;
    },
    {
      onSuccess({ item, is_playing, progress_ms }) {
        setCurrentPlayback({ item, progress_ms });
        setIsPlaying(is_playing);
      },
      onError(err) {
        console.error(err);
      },
    },
  );
}
