import { useRecoilValue } from "recoil";
import { clientAccessTokenState } from "atoms/client-access-token";
const { REACT_APP_SPOTIFY_API_URL: SPOTIFY_API_URL } = process.env;

export function useSearch() {
	const token = useRecoilValue(clientAccessTokenState);
	const headers = {
		Authorization: `Bearer ${token}`,
	};
	return async function search(query) {
		try {
			const response = await fetch(
				`${SPOTIFY_API_URL}/search?query=${query}&type=track&market=US`,
				{ headers },
			);
			const { tracks } = await response.json();
			return tracks;
		} catch (err) {
			console.error(err);
		}
	};
}
