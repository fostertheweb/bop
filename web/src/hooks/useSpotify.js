import { useEffect } from "react";
import debounce from "lodash/debounce";

const storageKey = "bop:spotify";
const url = "https://api.spotify.com/v1";

export default function () {
  useEffect(() => {
    requestAuth();
  }, []);

  const token = getSpotifyAccessToken();

  const search = async query => {
    if (query) {
      try {
        const response = await fetch(`${url}/search?query=${query}&type=track&market=US`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return await response.json();
      } catch (err) {
        console.error(err);
      }
    } else {
      return { tracks: [] };
    }
  };

  const searchSpotify = debounce(search, 250, { leading: true, trailing: true });

  const createPlaylist = async user_id => {
    const response = await fetch(`${url}/users/${user_id}/playlists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Lets bop",
        description: "this was created by bop :) happy bopping",
      }),
    });
    return await response.json();
  };

  return { searchSpotify, createPlaylist };
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

export function getSpotifyAccessToken() {
  try {
    return localStorage.getItem(storageKey);
  } catch (err) {
    console.log(err);
  }
}
