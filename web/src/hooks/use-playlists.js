import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { userAccessTokenAtom } from "hooks/use-login";

const { REACT_APP_SPOTIFY_API_BASE_URL: SPOTIFY_API_BASE_URL } = process.env;

export function usePlaylists(userDetails) {
  const userAccessToken = useRecoilValue(userAccessTokenAtom);
  const { isFetching, data } = useQuery(
    ["playlists", userDetails],
    async (_, details) => {
      const response = await fetch(
        `${SPOTIFY_API_BASE_URL}/users/${details.id}/playlists`,
        {
          headers: {
            Authorization: `Bearer ${userAccessToken}`,
          },
        },
      );
      const json = await response.json();

      if (response.ok) {
        return json;
      }

      throw json;
    },
    {
      enabled: userAccessToken && userDetails?.id,
    },
  );

  return { loading: isFetching, playlists: data };
}
