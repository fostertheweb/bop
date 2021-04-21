import { queryCache, useMutation, useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { userAccessTokenState } from "hooks/spotify/use-login";
import axios from "axios";

const { REACT_APP_SPOTIFY_API_URL: SPOTIFY_API_URL } = process.env;

export function useGetLikedSongs() {
  const userAccessToken = useRecoilValue(userAccessTokenState);
  return useQuery(
    userAccessToken && "likes",
    async () => {
      const { data } = await axios.get(`${SPOTIFY_API_URL}/me/tracks`, {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      });
      return data.items;
    },
    { retry: false, refetchOnWindowFocus: false },
  );
}

export function useCheckIfSavedTrack(trackId) {
  const userAccessToken = useRecoilValue(userAccessTokenState);
  return useQuery(trackId && ["checkTrack", trackId], async () => {
    const { data } = await axios.get(
      `${SPOTIFY_API_URL}/me/tracks/contains?ids=${trackId}`,
      {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      },
    );
    return data[0];
  });
}

export function useSaveTrack(trackId) {
  const userAccessToken = useRecoilValue(userAccessTokenState);
  return useMutation(
    async function saveTrack() {
      const { data } = await axios.put(
        `${SPOTIFY_API_URL}/me/tracks`,
        { ids: [trackId] },
        {
          headers: {
            Authorization: `Bearer ${userAccessToken}`,
          },
        },
      );
      return data;
    },
    {
      onSuccess() {
        queryCache.refetchQueries(["checkTrack", trackId]);
      },
    },
  );
}

export function useRemoveTrack(trackId) {
  const userAccessToken = useRecoilValue(userAccessTokenState);
  return useMutation(
    async function removeTrack() {
      const { data } = await axios.delete(
        `${SPOTIFY_API_URL}/me/tracks?ids=${trackId}`,
        {
          headers: {
            Authorization: `Bearer ${userAccessToken}`,
          },
        },
      );
      return data;
    },
    {
      onSuccess() {
        queryCache.refetchQueries(["checkTrack", trackId]);
      },
    },
  );
}
