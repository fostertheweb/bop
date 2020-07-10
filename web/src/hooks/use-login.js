import { useState, useCallback, useMemo } from "react";
import { useSetRecoilState } from "recoil";
import {
	userAccessTokenAtom,
	userRefreshTokenAtom,
} from "atoms/user-credentials";

const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

export function useLogin() {
	const setUserAccessToken = useSetRecoilState(userAccessTokenAtom);
	const setUserRefreshToken = useSetRecoilState(userRefreshTokenAtom);
	const [status, setStatus] = useState("idle");

	const login = useCallback(async (code, redirect_uri, grant_type) => {
		setStatus("pending");

		try {
			const response = await fetch(`${API_BASE_URL}/login`, {
				method: "POST",
				body: JSON.stringify({ code, redirect_uri, grant_type }),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.error) {
				throw response.error;
			}

			const { access_token, refresh_token } = await response.json();

			if (response.ok && access_token && refresh_token) {
				setUserAccessToken(access_token);
				setUserRefreshToken(refresh_token);
				setStatus("success");
			}
		} catch (err) {
			setStatus("failure");
		}
	});

	return { login, status };
}
