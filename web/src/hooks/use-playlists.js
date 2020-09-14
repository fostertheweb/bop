import { useQuery } from "react-query";
import { useQuery } from "react-query";
import { useRecoileValue } from "recoil";
import { userAccessTokenAtom } from "hooks/use-login";
import axios from "axios";

const { REACT_APP_SPOTIFY_API_BASE_URL: SPOTIFY_API_BASE_URL } = process.env;

export function usePlaylists(userDetails) {
  const userAccessToken = useRecoileValue(userAccessTokenAtom);
  return useQuery(userDetails && ["playlists", userDetails.id], async () => {
    const headers = {
      Authorization: `Bearer ${userAccessToken}`,
    };
    return await axios.get(
      `${SPOTIFY_API_BASE_URL}/users/${details.id}/playlists`,
      { headers },
    );
  });
}
