import {
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
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

export const userAccessTokenState = atom({
  key: "crowdQ.storage.userAccessToken",
  default: null,
  persistence_UNSTABLE: true,
});

export const userRefreshTokenState = atom({
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
  const setUserAccessToken = useSetRecoilState(userAccessTokenState);
  const setUserRefreshToken = useSetRecoilState(userRefreshTokenState);

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
  const setUserAccessToken = useSetRecoilState(userAccessTokenState);
  const [userRefreshToken, setUserRefreshToken] = useRecoilState(
    userRefreshTokenState,
  );

  return useMutation(
    async () => {
      const { data } = await axios.post(`${API_BASE_URL}/spotify/refresh`, {
        refresh_token: userRefreshToken,
      });
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

const redirectTotState = atom({
  key: "crowdQ.storage.redirectTo",
  default: null,
  persistence_UNSTABLE: true,
});

export function useRedirectTo() {
  return useRecoilValue(redirectTotState);
}

export function useSetRedirectTo() {
  return useSetRecoilState(redirectTotState);
}
