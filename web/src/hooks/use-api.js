import { useFetch } from "./use-fetch";
import { userCredentialsState } from "../atoms/user-credentials";
import { useRecoilValue } from "recoil";

export function useAPI() {
	const userCredentials = useRecoilValue(userCredentialsState);
	const headers = {
		Authorization: `Bearer ${userCredentials.access_token}`,
	};
	const API_BASE_URL = "http://localhost:4000";
	return useFetch(API_BASE_URL, { headers });
}
