import { atom, selector } from "recoil";
import { userAccessTokenAtom } from "./user-credentials";

const { REACT_APP_SPOTIFY_API_URL: SPOTIFY_API_URL } = process.env;

export const currentUserIdState = atom({
	key: "crowdQ.currentUserId",
	default: null,
});

export const userDetailsSelector = selector({
	key: "crowdQ.storage.userDetails",
	get: async ({ get, set }) => {
		const userAccessToken = get(userAccessTokenAtom);

		if (userAccessToken) {
			const response = await fetch(`${SPOTIFY_API_URL}/me`, {
				headers: {
					Authorization: `Bearer ${userAccessToken}`,
				},
			});
			const json = await response.json();

			if (response.ok) {
				set(currentUserIdState, json.id);
				return json;
			}

			throw json;
		}

		return null;
	},
	persistence_UNSTABLE: true,
});
