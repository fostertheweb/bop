import { useRecoilValue } from "recoil";
import { userAccessTokenAtom, clientAccessTokenState } from "hooks/use-login";

const { REACT_APP_SPOTIFY_API_BASE_URL: SPOTIFY_API_BASE_URL } = process.env;

export function useSearch(anonymousRequest = false) {
  const clientToken = useRecoilValue(clientAccessTokenState);
  const userToken = useRecoilValue(userAccessTokenAtom);
  const token = anonymousRequest && clientToken ? clientToken : userToken;

  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return async function search(_, query) {
    try {
      const response = await fetch(
        `${SPOTIFY_API_BASE_URL}/search?query=${query}&type=track&market=US`,
        { headers },
      );
      const { tracks } = await response.json();
      return tracks;
    } catch (err) {
      console.error(err);
    }
  };
}
