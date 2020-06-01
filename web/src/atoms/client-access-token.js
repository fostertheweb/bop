import { selector } from "recoil";

const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

export const clientAccessTokenSelector = selector({
	key: "crowdQ.storage.clientAccessToken",
	get: async () => {
		const response = await fetch(`${API_BASE_URL}/authorize`);
		const { access_token } = await response.json();
		return access_token;
	},
});
