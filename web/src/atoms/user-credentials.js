import { atom, selectorFamily } from "recoil";

const API_BASE_URL = "http://localhost:4000";

export const userAccessTokenAtom = atom({
	key: "crowdQ.storage.userAccessToken",
	default: null,
});

export const userRefreshTokenAtom = atom({
	key: "crowdQ.storage.userRefreshToken",
	default: null,
});

export const loginQuery = selectorFamily({
	key: "crowdQ.user",
	get: (query) => async () => {
		const response = await fetch(`${API_BASE_URL}/login`, {
			method: "POST",
			body: JSON.stringify(query),
		});
		return await response.json();
	},
	set: ({ set }, { access_token, refresh_token }) => {
		set(userAccessTokenAtom, access_token);
		set(userRefreshTokenAtom, refresh_token);
	},
});
