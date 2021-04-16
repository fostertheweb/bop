import { useQuery } from "react-query";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { userAccessTokenState } from "hooks/use-login";
import { useSetIsPlaybackLoading, useSetIsPlaying } from "hooks/use-player";
import axios from "axios";
import { useParams } from "react-router";

const {
  REACT_APP_API_URL: API_URL,
  REACT_APP_SPOTIFY_API_URL: SPOTIFY_API_URL,
} = process.env;

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
  const { id } = useParams();
  const setIsPlaying = useSetIsPlaying();
  const setCurrentPlayback = useSetCurrentPlayback();
  const setIsPlaybackLoading = useSetIsPlaybackLoading();

  return useQuery(
    id && ["currentPlayback", id],
    async () => {
      const { data } = await axios.get(
        `${API_URL}/rooms/${id}/current-playback`,
      );
      return data;
    },
    {
      onSettled() {
        setIsPlaybackLoading(false);
      },
      onSuccess(currentPlayback) {
        setCurrentPlayback(currentPlayback);
        setIsPlaying(true);
      },
      refetchOnWindowFocus: true,
      retry: false,
    },
  );
}

export function useGetSpotifyCurrentPlayback() {
  const userAccessToken = useRecoilValue(userAccessTokenState);
  const setIsPlaying = useSetIsPlaying();
  const setCurrentPlayback = useSetCurrentPlayback();

  return useQuery(
    "currentPlayback",
    async () => {
      const { data } = await axios.get(
        `${SPOTIFY_API_URL}/me/player/currently-playing`,
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
