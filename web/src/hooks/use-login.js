import { atom, useRecoilState, useSetRecoilState } from "recoil";
import { stringify } from "query-string";
import { useMutation } from "react-query";
import axios from "axios";

const {
  REACT_APP_API_BASE_URL: API_BASE_URL,
  REACT_APP_SPOTIFY_CLIENT_ID: SPOTIFY_CLIENT_ID,
} = process.env;

const scope = [
  "user-read-private",
  "playlist-read-private",
  "playlist-modify-public",
  "playlist-read-collaborative",
  "user-read-currently-playing",
  "user-modify-playback-state",
  "user-read-playback-state",
  "app-remote-control",
  "streaming",
].join(" ");

export const userAccessTokenAtom = atom({
  key: "crowdQ.storage.userAccessToken",
  default: null,
  persistence_UNSTABLE: true,
});

export const userRefreshTokenAtom = atom({
  key: "crowdQ.storage.userRefreshToken",
  default: null,
  persistence_UNSTABLE: true,
});

export function useLoginUrl(redirect_uri) {
  return `https://accounts.spotify.com/authorize?${stringify({
    response_type: "code",
    client_id: SPOTIFY_CLIENT_ID,
    scope,
    redirect_uri,
  })}`;
}

export function useLogin() {
  const setUserAccessToken = useSetRecoilState(userAccessTokenAtom);
  const setUserRefreshToken = useSetRecoilState(userRefreshTokenAtom);

  return useMutation(
    async (payload) => {
      const { data } = await axios.post(
        `${API_BASE_URL}/spotify/login`,
        payload,
      );
      return data;
    },
    {
      onSuccess({ access_token, refresh_token }) {
        setUserAccessToken(access_token);
        setUserRefreshToken(refresh_token);
      },
    },
  );
}

export function useRefreshSession() {
  const setUserAccessToken = useSetRecoilState(userAccessTokenAtom);
  const [userRefreshToken, setUserRefreshToken] = useRecoilState(
    userRefreshTokenAtom,
  );

  return useMutation(
    async () => {
      const { data } = await axios.post(
        `${API_BASE_URL}/spotify/refresh?${stringify({
          refresh_token: userRefreshToken,
        })}`,
      );
      return data;
    },
    {
      onSuccess({ access_token, refresh_token }) {
        setUserAccessToken(access_token);
        setUserRefreshToken(refresh_token);
      },
    },
  );
}
