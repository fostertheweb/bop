import { atom, selector, selectorFamily } from "recoil";

const API_BASE_URL = "http://localhost:4000";

export const loginQuery = selectorFamily({
	key: "crowdQ.storage.user",
	get: (query) => async () => {
		const response = await fetch(`${API_BASE_URL}/login`, {
			method: "POST",
			body: JSON.stringify(query),
		});
		return await response.json();
	},
});

export const userAccessToken = atom({
	key: "crowdQ.storage.userAccessToken",
	default: null,
});

export const userRefreshToken = atom({
	key: "crowdQ.storage.userRefreshToken",
	default: null,
});
