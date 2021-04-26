import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { userAccessTokenState } from "hooks/spotify/use-login";
import { usePlayQueue, useQueue } from "hooks/use-queue";
import { useMutation, useQueryCache } from "react-query";
import { useSetCurrentPlayback } from "hooks/use-current-playback";
import Axios from "axios";
import { useParams } from "react-router";

const {
  REACT_APP_SPOTIFY_API_URL: SPOTIFY_API_URL,
  REACT_APP_API_URL: API_URL,
} = process.env;

const isPlaybackLoading = atom({
  key: "crowdQ.isPlaybackLoading",
  default: false,
});

export function useIsPlaybackLoading() {
  return useRecoilValue(isPlaybackLoading);
}

export function useSetIsPlaybackLoading() {
  return useSetRecoilState(isPlaybackLoading);
}

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
        `${SPOTIFY_API_URL}/me/player/seek?position_ms=0`,
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
      return Axios.put(`${SPOTIFY_API_URL}/me/player/pause`, null, {
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
      return Axios.put(`${SPOTIFY_API_URL}/me/player/play`, null, {
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
  const { playNext } = useQueue();
  const [item] = usePlayQueue();
  const setCurrentPlayback = useSetCurrentPlayback();

  return useMutation(
    async () => {
      return await Axios.put(
        `${SPOTIFY_API_URL}/me/player/play`,
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
        playNext();
        setCurrentPlayback({ item, progress_ms: 0 });
      },
    },
  );
}

export function usePlayNext() {
  const { id } = useParams();
  return useMutation(
    async () => {
      return await Axios.put(`${API_URL}/rooms/${id}/play-next`);
    },
    {
      onSuccess() {
        console.log("playing");
      },
    },
  );
}
