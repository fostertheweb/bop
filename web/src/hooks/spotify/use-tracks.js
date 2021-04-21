import axios from "axios";
import { useQuery } from "react-query";
import { useGetSpotifyCredentials } from "hooks/spotify/use-spotify";

const { REACT_APP_SPOTIFY_API_URL: SPOTIFY_API_URL } = process.env;

export function useGetTrackById(trackId) {
  const { data: credentials } = useGetSpotifyCredentials();

  return useQuery(
    credentials && trackId && ["getTrack", trackId],
    async () => {
      const { data } = await axios.get(`${SPOTIFY_API_URL}/tracks/${trackId}`, {
        headers: {
          Authorization: `Bearer ${credentials.access_token}`,
        },
      });
      return data;
    },
    {
      onError(err) {
        console.error(err);
      },
    },
  );
}
