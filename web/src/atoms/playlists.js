import { selectorFamily } from "recoil";
import { userAccessTokenAtom } from "./user-credentials";

const { REACT_APP_SPOTIFY_API_URL: SPOTIFY_API_URL } = process.env;

export const userPlaylistsQuery = selectorFamily({
	key: "crowdQ.playlists",
	get: (userId) => async ({ get }) => {
		const userAccessToken = get(userAccessTokenAtom);

		if (userAccessToken && userId) {
			const response = await fetch(
				`${SPOTIFY_API_URL}/users/${userId}/playlists`,
				{
					headers: {
						Authorization: `Bearer ${userAccessToken}`,
					},
				},
			);
			const json = await response.json();

			if (response.ok) {
				return json.items;
			}

			throw json;
		}

		return null;
	},
});
