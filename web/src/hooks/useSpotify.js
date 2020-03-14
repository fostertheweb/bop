import React, { useEffect } from "react";

const storageKey = "bop:spotify";

export function useSpotify() {
  useEffect(() => {
    requestAuth();
  }, []);

  const search = async query => {
    const url = "https://api.spotify.com/v1/search";

    try {
      const response = await fetch(`${url}?query=${query}&type=artist,track`, {
        headers: {
          Authorization: `Bearer ${getSpotifyAccessToken()}`,
        },
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  };

  return { search };
}

async function requestAuth() {
  const url = `http://localhost:4000/spotify`;
  try {
    const response = await fetch(url);
    const credentials = await response.json();
    storeSpotifyAccessToken(credentials.access_token);
  } catch (err) {
    console.error(err);
  }
}

function storeSpotifyAccessToken(token) {
  localStorage.setItem(storageKey, token);
}

function getSpotifyAccessToken() {
  try {
    return localStorage.getItem(storageKey);
  } catch (err) {
    console.log(err);
  }
}
