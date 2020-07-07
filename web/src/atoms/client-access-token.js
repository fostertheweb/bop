import { atom, selector } from "recoil";

const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

export const clientAccessTokenQuery = selector({
	key: "crowdQ.clientAccessTokenQuery",
	get: async () => {
		const response = await fetch(`${API_BASE_URL}/authorize`);
		return await response.json();
	},
});

export const clientAccessTokenState = atom({
	key: "crowdQ.clientAccessToken",
	default: null,
});
