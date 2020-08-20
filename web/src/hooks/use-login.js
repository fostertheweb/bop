import { useState } from "react";
import { atom, useRecoilState, useSetRecoilState } from "recoil";
import { stringify } from "query-string";

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

export function useLogin() {
  const setUserAccessToken = useSetRecoilState(userAccessTokenAtom);
  const [userRefreshToken, setUserRefreshToken] = useRecoilState(
    userRefreshTokenAtom,
  );
  const [status, setStatus] = useState("idle");

  function redirect(redirect_uri) {
    return `https://accounts.spotify.com/authorize?${stringify({
      response_type: "code",
      client_id: SPOTIFY_CLIENT_ID,
      scope,
      redirect_uri,
    })}`;
  }

  async function login(code, redirect_uri) {
    setStatus("pending");

    try {
      const response = await fetch(`${API_BASE_URL}/spotify/login`, {
        method: "POST",
        body: JSON.stringify({
          code,
          redirect_uri,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.error) {
        throw response.error;
      }

      const { access_token, refresh_token } = await response.json();

      if (response.ok && access_token && refresh_token) {
        setUserAccessToken(access_token);
        setUserRefreshToken(refresh_token);
        setStatus("success");
      }
    } catch (err) {
      setStatus("failure");
    }
  }

  async function refresh() {
    setStatus("pending");
    try {
      const response = await fetch(
        `${API_BASE_URL}/spotify/refresh?${stringify({
          refresh_token: userRefreshToken,
        })}`,
        { method: "POST" },
      );

      if (response.error) {
        throw response.error;
      }

      const { access_token, refresh_token } = await response.json();

      if (response.ok && access_token && refresh_token) {
        setUserAccessToken(access_token);
        setUserRefreshToken(refresh_token);
        setStatus("success");
      }
    } catch (err) {
      setStatus("failure");
    }
  }

  return { login, redirect, refresh, status };
}
