import { useQuery, useInfiniteQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { userAccessTokenState } from "hooks/spotify/use-login";
import axios from "axios";

const { REACT_APP_SPOTIFY_API_URL: SPOTIFY_API_URL } = process.env;

export function useGetPlaylists(userDetails) {
  const userAccessToken = useRecoilValue(userAccessTokenState);
  return useInfiniteQuery(
    userDetails && "playlists",
    async ({ pageParam = 0 }) => {
      const { data } = await axios.get(
        `${SPOTIFY_API_URL}/me/playlists?limit=10&offset=${pageParam}`,
        {
          headers: {
            Authorization: `Bearer ${userAccessToken}`,
          },
        },
      );
      return { data, offset: data.length };
    },
    {
      getNextPageParam: (lastGroup) => lastGroup.offset,
      enabled: !!userDetails && !!userAccessToken,
    },
  );
}

export function useGetPlaylistTracks(id) {
  const userAccessToken = useRecoilValue(userAccessTokenState);
  return useQuery(id && ["playlist", id], async () => {
    const { data } = await axios.get(
      `${SPOTIFY_API_URL}/playlists/${id}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      },
    );
    return data.items.map((i) => i.track);
  });
}
