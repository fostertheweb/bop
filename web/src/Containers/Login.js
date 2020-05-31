import React from "react";
import { useLocation } from "react-router-dom";
import { parse } from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { loginQuery } from "../atoms/user-credentials";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { useRecoilValueLoadable } from "recoil";

const API_BASE_URL = "http://localhost:4000";

export default function Login() {
	const location = useLocation();
	// const navigate = useNavigate();
	const query = parse(location.search);
	const { state, contents } = useRecoilValueLoadable(loginQuery(query));

	if (state === "hasValue") {
		console.log({ value: contents });
		// navigate("/host/search");
	}

	if (state === "hasError") {
		console.error({ error: contents });
	}

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
