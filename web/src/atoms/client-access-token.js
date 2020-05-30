import { selector } from "recoil";

const API_BASE_URL = "http://localhost:4000";

export const clientAccessTokenAtom = selector({
	key: "crowdQ.storage.clientAccessToken",
	get: async () => {
		const response = await fetch(`${API_BASE_URL}/authorize`);
		const { access_token } = await response.json();
		return access_token;
	},
});
