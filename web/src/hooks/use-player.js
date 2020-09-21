import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { userAccessTokenState } from "hooks/use-login";
import { usePlayQueue, useQueue } from "hooks/use-queue";
import { useMutation, useQueryCache } from "react-query";
import { useSetCurrentPlayback } from "hooks/use-current-playback";
import Axios from "axios";

const { REACT_APP_SPOTIFY_API_BASE_URL: SPOTIFY_API_BASE_URL } = process.env;

export const isPlayingState = atom({
  key: "crowdQ.isPlaying",
  default: false,
});

export function useIsPlaying() {
  return useRecoilValue(isPlayingState);
}

export function useSetIsPlaying() {
  return useSetRecoilState(isPlayingState);
}

export function useRestartCurrentTrack() {
  const userAccessToken = useRecoilValue(userAccessTokenState);
  const queryCache = useQueryCache();

  return useMutation(
    async () => {
      return Axios.put(
        `${SPOTIFY_API_BASE_URL}/me/player/seek?position_ms=0`,
        null,
        {
          headers: {
            Authorization: `Bearer ${userAccessToken}`,
          },
        },
      );
    },
    {
      onSuccess() {
        queryCache.refetchQueries("currentPlayback");
      },
    },
  );
}

export function usePause() {
  const userAccessToken = useRecoilValue(userAccessTokenState);
  const setIsPlaying = useSetIsPlaying();

  return useMutation(
    async () => {
      return Axios.put(`${SPOTIFY_API_BASE_URL}/me/player/pause`, null, {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      });
    },
    {
      onSuccess() {
        setIsPlaying(false);
      },
    },
  );
}

export function usePlay() {
  const userAccessToken = useRecoilValue(userAccessTokenState);
  const setIsPlaying = useSetIsPlaying();

  return useMutation(
    async () => {
      return Axios.put(`${SPOTIFY_API_BASE_URL}/me/player/play`, null, {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      });
    },
    {
      onSuccess() {
        setIsPlaying(true);
      },
    },
  );
}

export function usePlayNextTrack() {
  const userAccessToken = useRecoilValue(userAccessTokenState);
  const { nextTrackInQueue } = useQueue();
  const [item] = usePlayQueue();
  const setCurrentPlayback = useSetCurrentPlayback();

  return useMutation(
    async () => {
      return await Axios.put(
        `${SPOTIFY_API_BASE_URL}/me/player/play`,
        {
          uris: [item?.uri],
        },
        {
          headers: {
            Authorization: `Bearer ${userAccessToken}`,
          },
        },
      );
    },
    {
      onSuccess() {
        nextTrackInQueue();
        setCurrentPlayback({ item, progress_ms: 0 });
      },
    },
  );
}
