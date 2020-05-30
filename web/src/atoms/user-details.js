import { selector } from "recoil";
import { userAccessToken } from "./user-credentials";

const SPOTIFY_API_URL = "https://api.spotify.com/v1";

export const userDetailsSelector = selector({
	key: "crowdQ.storage.userDetails",
	get: async ({ get }) => {
		const response = await fetch(`${SPOTIFY_API_URL}/me`, {
			headers: {
				Authorization: `Bearer ${get(userAccessToken)}`,
			},
		});
		return await response.json();
	},
});
