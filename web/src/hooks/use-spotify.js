import React, { useEffect } from "react";

const storageKey = "bop:spotify";

export function useSpotify() {
  useEffect(() => {
    requestAuth();
  }, []);

  return {};
}

async function search

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
  return localStorage.getItem(storageKey);
}
