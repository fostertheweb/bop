import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { userAccessTokenState } from "hooks/use-login";
import axios from "axios";

const { REACT_APP_SPOTIFY_API_URL: SPOTIFY_API_URL } = process.env;

export function useLikedSongs(userDetails) {
  const userAccessToken = useRecoilValue(userAccessTokenState);
  return useQuery(userDetails && ["likes", userDetails.id], async () => {
    const { data } = await axios.get(`${SPOTIFY_API_URL}/me/tracks`, {
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
      },
    });
    return data.items;
  });
}
