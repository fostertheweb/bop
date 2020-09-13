import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { userAccessTokenAtom } from "hooks/use-login";

const { REACT_APP_SPOTIFY_API_BASE_URL: SPOTIFY_API_BASE_URL } = process.env;

export function useUserDetails() {
  const userAccessToken = useRecoilValue(userAccessTokenAtom);
  const { isFetching, data } = useQuery(
    ["userDetails", userAccessToken],
    async (_, token) => {
      const response = await fetch(`${SPOTIFY_API_BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        return json;
      }

      throw json;
    },
    { enabled: userAccessToken },
  );

  return { isFetching, userDetails: data };
}
