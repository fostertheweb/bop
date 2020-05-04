import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import debounce from "lodash/debounce";
import { stringify as stringifyQueryString } from "query-string";

export const SpotifyContext = React.createContext(null);

export function SpotifyProvider({ children }) {
  const spotify = useSpotifyProvider();
  return <SpotifyContext.Provider value={spotify}>{children}</SpotifyContext.Provider>;
}

export function useSpotify() {
  return useContext(SpotifyContext);
}

const CLIENT_STORAGE_KEY = "BOP_APP";
const USER_STORAGE_KEY = "BOP_USER";
const SPOTIFY_API_URL = "https://api.spotify.com/v1";
const API_BASE_URL = "http://localhost:4000";

export function useSpotifyProvider() {
  const [clientAccessToken, setClientAccessToken] = useState(getClientAccessTokenFromStorage());
  const [userCredentials, setUserCredentials] = useState(getUserCredentialsFromStorage());
  const [userDetails, setUserDetails] = useState(null);

  async function fetchClientAccess() {
    try {
      const url = `${API_BASE_URL}/authorize`;
      const response = await fetch(url);
      const { access_token } = await response.json();
      setClientAccessToken(access_token);
    } catch (err) {
      console.error(err);
    }
  }

  function storeClientAccessToken(token) {
    localStorage.setItem(CLIENT_STORAGE_KEY, token);
  }

  function getClientAccessTokenFromStorage() {
    return localStorage.getItem(CLIENT_STORAGE_KEY);
  }

  useEffect(() => {
    if (clientAccessToken === null) {
      fetchClientAccess();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    storeClientAccessToken(clientAccessToken);
  }, [clientAccessToken]);

  async function fetchUserCredentials(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        body: JSON.stringify(query),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { access_token, refresh_token } = await response.json();
      setUserCredentials({ code: query.code, access_token, refresh_token });
    } catch (err) {
      console.error(err);
    }
  }

  function getUserCredentialsFromStorage() {
    const credentials = localStorage.getItem(USER_STORAGE_KEY);

    if (credentials) {
      return JSON.parse(credentials);
    } else {
      return null;
    }
  }

  function storeUserCredentials(credentials) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(credentials));
  }

  useEffect(() => {
    if (userCredentials !== null) {
      refreshUserAccessToken();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    storeUserCredentials(userCredentials);
  }, [userCredentials]);

  const getUserDetails = useQuery("user", [userCredentials], async () => {
    const response = await fetch(`${SPOTIFY_API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${userCredentials.access_token}`,
      },
    });
    return await response.json();
  });

  useEffect(() => {
    if (getUserDetails.status === "success" && userDetails === null && getUserDetails.data) {
      setUserDetails(getUserDetails.data);
    }
  }, [getUserDetails, userDetails]);

  useEffect(() => {
    getUserDetails.refetch();
  }, [userCredentials]);

  async function refreshUserAccessToken() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/refresh?${stringifyQueryString({
          refresh_token: userCredentials.refresh_token,
        })}`,
      );
      const { access_token } = await response.json();
      console.log("Refreshing Spotify User Access Token");
      setUserCredentials({ ...userCredentials, access_token });
    } catch (err) {
      console.error(err);
    }
  }

  async function search(query) {
    try {
      const response = await fetch(
        `${SPOTIFY_API_URL}/search?query=${query}&type=track&market=US`,
        {
          headers: {
            Authorization: `Bearer ${userCredentials.access_token}`,
          },
        },
      );
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  return {
    userCredentials,
    userDetails,
    fetchUserCredentials,
    refreshUserAccessToken,
    search: debounce(search, 250, { leading: true, tailing: true }),
  };
}

// TODO
// does react-query give us debouce functionality?
