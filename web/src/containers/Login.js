import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parse } from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import {
	loginQuery,
	userAccessTokenAtom,
	userRefreshTokenAtom,
} from "../atoms/user-credentials";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { useRecoilValueLoadable, useSetRecoilState } from "recoil";

const { REACT_APP_API_BASE_URL: API_BASE_URL } = process.env;

export default function Login() {
	const location = useLocation();
	const navigate = useNavigate();
	const query = parse(location.search);
	const { state, contents } = useRecoilValueLoadable(loginQuery(query));
	const setUserAccessToken = useSetRecoilState(userAccessTokenAtom);
	const setUserRefreshToken = useSetRecoilState(userRefreshTokenAtom);

	useEffect(() => {
		if (state === "hasValue" && contents) {
			setUserAccessToken(contents.access_token);
			setUserRefreshToken(contents.refresh_token);
			navigate("/host/search");
		}
	}, [state, contents, navigate]);

	return (
		<div className="flex flex-col justify-center h-screen w-full items-center">
			<a
				href={`${API_BASE_URL}/login`}
				className="px-6 py-4 rounded-full bg-green-500 text-white leading hover:bg-green-600">
				{state === "loading" ? (
					<FontAwesomeIcon icon={faSpinnerThird} spin size="lg" />
				) : (
					<FontAwesomeIcon icon={faSpotify} size="lg" />
				)}
				<span className="ml-2">Log in with Spotify</span>
			</a>
		</div>
	);
}
