import { useState } from "react";
import { atom, selector, useRecoilState, useSetRecoilState } from "recoil";
import { stringify } from "query-string";

const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

export const clientAccessTokenQuery = selector({
  key: "crowdQ.clientAccessTokenQuery",
  get: async () => {
    const response = await fetch(`${API_BASE_URL}/authorize`);
    return await response.json();
  },
});

export const clientAccessTokenState = atom({
  key: "crowdQ.clientAccessToken",
  default: null,
});

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

  async function login(code, redirect_uri, grant_type) {
    setStatus("pending");

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        body: JSON.stringify({ code, redirect_uri, grant_type }),
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
        `${API_BASE_URL}/refresh?${stringify({
          refresh_token: userRefreshToken,
        })}`,
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

  return { login, refresh, status };
}
