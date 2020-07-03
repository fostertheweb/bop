import { atom, selector } from "recoil";
import { userAccessTokenAtom } from "atoms/user-credentials";

const { REACT_APP_SPOTIFY_API_URL: SPOTIFY_API_URL } = process.env;

export const currentDeviceAtom = atom({
	key: "crowdQ.storage.currentDevice",
	default: null,
	persistence_UNSTABLE: true,
});

export const devicesQuery = selector({
	key: "crowdQ.devices",
	get: async ({ get }) => {
		const token = get(userAccessTokenAtom);
		const response = await fetch(`${SPOTIFY_API_URL}/me/player/devices`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return await response.json();
	},
});
