import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { userAccessTokenState } from "hooks/use-login";
import Axios from "axios";

const { REACT_APP_SPOTIFY_API_BASE_URL: SPOTIFY_API_BASE_URL } = process.env;

export function useUserDetails() {
  const userAccessToken = useRecoilValue(userAccessTokenState);
  //  const [refresh] = useRefreshSession();

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
    {
      onError(err) {
        if (err?.response?.status === 401) {
          console.log("Access token has expired, need to refresh");
        }
      },
    },
  );
}
