import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { userAccessTokenState } from "hooks/use-login";
import axios from "axios";

const { REACT_APP_SPOTIFY_API_BASE_URL: SPOTIFY_API_BASE_URL } = process.env;

export function usePlaylists(userDetails) {
  const userAccessToken = useRecoilValue(userAccessTokenState);
  return useQuery(userDetails && ["playlists", userDetails.id], async () => {
    const { data } = await axios.get(
      `${SPOTIFY_API_BASE_URL}/users/${userDetails.id}/playlists`,
      {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      },
    );
    return data;
  });
}
