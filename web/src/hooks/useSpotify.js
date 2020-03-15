import { useEffect } from "react";
import debounce from "lodash/debounce";

const storageKey = "bop:spotify";

export default function() {
  useEffect(() => {
    requestAuth();
  }, []);

  const search = async query => {
    const url = "https://api.spotify.com/v1/search";
    if (query) {
      try {
        const response = await fetch(`${url}?query=${query}&type=track&market=US`, {
          headers: {
            Authorization: `Bearer ${getSpotifyAccessToken()}`,
          },
        });
        return await response.json();
      } catch (err) {
        console.error(err);
      }
    } else {
      return {};
    }
  };

  const searchSpotify = debounce(search, 250, { leading: true });

  return { searchSpotify };
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
