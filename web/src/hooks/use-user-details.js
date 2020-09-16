import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { userAccessTokenAtom } from "hooks/use-login";
import Axios from "axios";

const { REACT_APP_SPOTIFY_API_BASE_URL: SPOTIFY_API_BASE_URL } = process.env;

export function useUserDetails() {
  const userAccessToken = useRecoilValue(userAccessTokenAtom);
  return useQuery(
    userAccessToken && ["userDetails", userAccessToken],
    async () => {
      const { data } = await Axios.get(`${SPOTIFY_API_BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      });
      return data;
    },
  );
}
