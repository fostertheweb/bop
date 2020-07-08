import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parse } from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import {
	userAccessTokenAtom,
	userRefreshTokenAtom,
} from "../atoms/user-credentials";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { useSetRecoilState } from "recoil";
import { useLogin } from "hooks/use-login";

const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

export default function Login() {
	const location = useLocation();
	const navigate = useNavigate();
	const query = parse(location.search);
	const setUserAccessToken = useSetRecoilState(userAccessTokenAtom);
	const setUserRefreshToken = useSetRecoilState(userRefreshTokenAtom);
	const login = useLogin();
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		async function getCredentials() {
			setLoading(true);
			login(query)
				.then((response) => {
					console.log(response);
					// setUserAccessToken(access_token);
					// setUserRefreshToken(refresh_token);
				})
				.catch(console.error)
				.finally(() => {
					setLoading(false);
					navigate("/host/search");
				});
		}

		if (query.code && query.redirect_uri) {
			console.log({ query });
			getCredentials();
		}
	}, [query]);

	return (
		<div className="flex flex-col justify-center h-screen w-full items-center">
			<a
				href={`${API_BASE_URL}/login`}
				className="px-6 py-4 rounded-full bg-green-500 text-white leading hover:bg-green-600">
				{isLoading ? (
					<FontAwesomeIcon icon={faSpinnerThird} spin size="lg" />
				) : (
					<FontAwesomeIcon icon={faSpotify} size="lg" />
				)}
				<span className="ml-2">Log in with Spotify</span>
			</a>
		</div>
	);
}
