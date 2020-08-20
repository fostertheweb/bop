import { useQuery } from "react-query";

const {
  REACT_APP_API_BASE_URL: API_BASE_URL,
  REACT_APP_SPOTIFY_API_BASE_URL: SPOTIFY_API_BASE_URL,
} = process.env;

export function useSearch(query) {
  const { data: credentials } = useQuery("clientAccessToken", async () => {
    const response = await fetch(`${API_BASE_URL}/spotify/authorize`);
    return await response.json();
  });

  const { isFetching, data } = useQuery(
    [credentials && "search", query],
    async (_, search) => {
      const response = await fetch(
        `${SPOTIFY_API_BASE_URL}/search?query=${search}&type=track&market=US`,
        {
          headers: {
            Authorization: `Bearer ${credentials.access_token}`,
          },
        },
      );
      const { tracks } = await response.json();
      return tracks;
    },
    { enabled: credentials && query },
  );

  return { isFetching, results: data };
}
