import axios from "axios";
import { useQuery } from "react-query";

const {
  REACT_APP_API_BASE_URL: API_BASE_URL,
  REACT_APP_SPOTIFY_API_BASE_URL: SPOTIFY_API_BASE_URL,
} = process.env;

export function useSearch(query) {
  const { data: credentials } = useQuery("clientAccessToken", async () => {
    const { data } = await axios.get(`${API_BASE_URL}/spotify/authorize`);
    return data;
  });

  return useQuery(credentials && ["search", query], async () => {
    if (query !== "") {
      const {
        data: {
          tracks: { items },
        },
      } = await axios.get(
        `${SPOTIFY_API_BASE_URL}/search?query=${query}&type=track&market=US`,
        {
          headers: {
            Authorization: `Bearer ${credentials.access_token}`,
          },
        },
      );
      return items;
    }

    return [];
  });
}
