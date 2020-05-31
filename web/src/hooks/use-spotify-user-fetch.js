import { useFetch } from "./use-fetch";
import { userCredentialsState } from "../atoms/user-credentials";
import { useRecoilValue } from "recoil";

export function useSpotifyUserFetch() {
	const userCredentials = useRecoilValue(userCredentialsState);
	const headers = {
		Authorization: `Bearer ${userCredentials.access_token}`,
	};
	const SPOTIFY_API_URL = "https://api.spotify.com/v1";
	return useFetch(SPOTIFY_API_URL, { headers });
}
