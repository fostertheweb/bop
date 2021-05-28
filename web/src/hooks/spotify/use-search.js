import axios from "axios";
import { useInfiniteQuery } from "react-query";
import { useGetSpotifyCredentials } from "hooks/spotify/use-spotify";

const { REACT_APP_SPOTIFY_API_URL: SPOTIFY_API_URL } = process.env;

export function useSearch(query) {
  const { data: credentials } = useGetSpotifyCredentials();

  return useInfiniteQuery(
    credentials && ["search", query],
    async ({ pageParam = 0 }) => {
      if (query !== "") {
        const {
          data: {
            tracks: { items },
          },
        } = await axios.get(
          `${SPOTIFY_API_URL}/search?query=${query}&type=track&market=US&limit=10&offset=${pageParam}`,
          {
            headers: {
              Authorization: `Bearer ${credentials.access_token}`,
            },
          },
        );
        return { items, offset: items.length };
      }

      return [];
    },
    {
      getNextPageParam: (lastGroup) => lastGroup.offset + 10,
      enabled: query !== "",
    },
  );
}
