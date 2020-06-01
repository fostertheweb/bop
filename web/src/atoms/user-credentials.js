import { atom, selector, selectorFamily } from "recoil";
import { stringify } from "query-string";

const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

export const userAccessTokenAtom = atom({
	key: "crowdQ.storage.userAccessToken",
	default: null,
	persistence_UNSTABLE: true,
});

export const userRefreshTokenAtom = atom({
	key: "crowdQ.storage.userRefreshToken",
	default: null,
	persistence_UNSTABLE: true,
});

export const loginQuery = selectorFamily({
	key: "crowdQ.user",
	get: (query) => async () => {
		if (query.code && query.redirect_uri) {
			const response = await fetch(`${API_BASE_URL}/login`, {
				method: "POST",
				body: JSON.stringify(query),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const json = await response.json();
			if (response.ok) {
				return json;
			}

			throw json;
		}

		return null;
	},
	// Does not seem to run, added set state methods in Login.js
	// set: () => ({ set }, newValue) => {
	// 	console.log({ newValue });
	// 	set(userAccessTokenAtom, newValue.access_token);
	// 	set(userRefreshTokenAtom, newValue.refresh_token);
	// },
});

export const refreshUserAccessTokenQuery = selector({
	key: "crowdQ.refresh",
	get: async ({ get, set }) => {
		const userRefreshToken = get(userAccessTokenAtom);

		if (userRefreshToken) {
			const response = await fetch(
				`${API_BASE_URL}/refresh?${stringify({
					refresh_token: userRefreshToken,
				})}`,
			);

			const json = await response.json();

			if (response.ok) {
				const { access_token } = json;
				set(userAccessTokenAtom, access_token);
				return json;
			}

			throw json;
		}

		return null;
	},
});
